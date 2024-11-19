import { database } from '@/config/firebase';
import { generateQuizQuestions } from '@/lib/questionGenerator';
import { Player, PlayerAnswer } from '@/types/player.types';
import { RoomManagerStore } from '@/types/room.store.types';
import { QuizRoom } from '@/types/room.types';
import { get as getDb, onValue, ref, set as setDb } from 'firebase/database';
import { create } from 'zustand';
import { useGameStore } from './gameStore';

export const useRoomStore = create<RoomManagerStore>((set, get) => ({
  activeRoom: null,
  participants: [],

  createRoom: async (hostId: string) => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newRoom: QuizRoom = {
      id: roomId,
      hostId,
      participants: [],
      status: 'waiting',
      currentQuestionIndex: 0,
      questions: [],
      answers: [],
      initialParticipantCount: 0
    };

    await setDb(ref(database, `rooms/${roomId}`), newRoom);
    return roomId;
  },

  joinRoom: async (roomId: string, player: Player) => {
    const roomRef = ref(database, `rooms/${roomId}`);
    const snapshot = await getDb(roomRef);
    const room = snapshot.val();

    if (!room) throw new Error('Room not found');
    if (room.participants?.length >= 8) throw new Error('Room is full');

    const participants = [...(room.participants || [])];
    const existingPlayer = participants.find(p => p.id === player.id);

    if (!existingPlayer) {
      participants.push(player);
    } else {
      const index = participants.indexOf(existingPlayer);
      participants[index] = {
        ...existingPlayer,
        disconnected: false
      };
    }

    await setDb(ref(database, `rooms/${roomId}/participants`), participants);

    // Initiate game state for participants
    if (room.status === 'playing') {
      useGameStore.getState().setQuestionIndex(room.currentQuestionIndex);
      useGameStore.getState().setLoading(false);
    }

    const unsubscribe = onValue(ref(database, `rooms/${roomId}`), (snapshot) => {
      const updatedRoom = snapshot.val();
      if (updatedRoom) {
        // Verify change of status to 'finished'
        if (updatedRoom.status === 'finished' &&
          (!room.status || room.status !== 'finished')) {
          useGameStore.getState().setComplete(true);
        }

        set({
          activeRoom: updatedRoom,
          participants: updatedRoom.participants || []
        });
      }
    });

    return () => unsubscribe();
  },

  exitRoom: async (roomId: string, playerId: string) => {
    const roomRef = ref(database, `rooms/${roomId}`);
    const snapshot = await getDb(roomRef);
    const room = snapshot.val();

    if (room) {
      const participants = room.participants.filter((p: Player) => p.id !== playerId);
      await setDb(ref(database, `rooms/${roomId}/participants`), participants);
    }
  },

  submitAnswer: async (roomId: string, playerId: string, answerIndex: number) => {
    try {
      const roomRef = ref(database, `rooms/${roomId}`);
      const snapshot = await getDb(roomRef);
      const room = snapshot.val() as QuizRoom;

      if (!room) return;

      const answer: PlayerAnswer = {
        playerId,
        questionId: room.currentQuestionIndex,
        // Always false for timeout (-1) or wrong answer
        isCorrect: answerIndex === room.questions[room.currentQuestionIndex].correctAnswer,
        answeredAt: Date.now()
      };

      const currentAnswers = [...(room.answers || [])];
      const updatedAnswers = [
        ...currentAnswers.filter(a => !(a.playerId === playerId && a.questionId === room.currentQuestionIndex)),
        answer
      ];

      const currentQuestionAnswers = updatedAnswers.filter(
        a => a.questionId === room.currentQuestionIndex
      );

      const activeParticipants = room.participants.filter(p => !p.disconnected);
      const readyForNext = currentQuestionAnswers.length >= activeParticipants.length;

      // Update room with new answers
      await setDb(ref(database, `rooms/${roomId}`), {
        ...room,
        answers: updatedAnswers,
        readyForNext,
        currentQuestionStartTime: readyForNext ? Date.now() : room.currentQuestionStartTime
      });

      if (readyForNext) {
        // When everyone finish answering, move to next question
        setTimeout(() => {
          useGameStore.getState().handleNextQuestion();
        }, 3000); // Wait 3 seconds before moving to next question
      }

    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  },

  beginQuiz: async (roomId: string) => {
    try {
      const questions = await generateQuizQuestions(10);

      if (!questions) {
        throw new Error('Não foi possível gerar as questões do quiz');
      }

      const roomRef = ref(database, `rooms/${roomId}`);
      const snapshot = await getDb(roomRef);
      const room = snapshot.val();

      const now = Date.now();
      await setDb(roomRef, {
        ...room,
        status: 'playing',
        startTime: now,
        currentQuestionStartTime: now,
        currentQuestionIndex: 0,
        questions,
        initialParticipantCount: room.participants.length,
        answers: []
      });

      return true;
    } catch (error) {
      console.error('Error starting quiz:', error);
      return false;
    }
  },

  nextQuestion: async (roomId: string) => {
    try {
      const roomRef = ref(database, `rooms/${roomId}`);
      const snapshot = await getDb(roomRef);
      const room = snapshot.val();

      if (!room) return;

      const nextIndex = room.currentQuestionIndex + 1;
      const isLastQuestion = nextIndex >= room.questions.length;

      if (!isLastQuestion) {
        await setDb(ref(database, `rooms/${roomId}`), {
          ...room,
          currentQuestionIndex: nextIndex,
          currentQuestionStartTime: Date.now(),
          readyForNext: false
        });
      } else {
        // Finish the game
        await setDb(ref(database, `rooms/${roomId}`), {
          ...room,
          status: 'finished',
          completedAt: Date.now()
        });
      }
    } catch (error) {
      console.error('Error updating question:', error);
    }
  },

  finishQuiz: async (roomId: string) => {
    try {
      const roomRef = ref(database, `rooms/${roomId}`);
      const snapshot = await getDb(roomRef);
      const room = snapshot.val();

      if (!room) return;

      await setDb(ref(database, `rooms/${roomId}`), {
        ...room,
        status: 'finished',
        completedAt: Date.now()
      });

      const unsubscribe = onValue(ref(database, `rooms/${roomId}/answers`), (snapshot) => {
        if (snapshot.exists()) {
          const updatedAnswers = snapshot.val();
          set((state) => ({
            ...state,
            activeRoom: state.activeRoom ? {
              ...state.activeRoom,
              answers: updatedAnswers
            } : null
          }));
        }
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Error finishing game:', error);
    }
  },

  resetRoom: async () => {
    const { activeRoom } = get();
    if (activeRoom) {
      try {
        // Remove room from database
        await setDb(ref(database, `rooms/${activeRoom.id}`), null);
        // Reset local state
        set({
          activeRoom: null,
          participants: []
        });
      } catch (error) {
        console.error('Error resetting room:', error);
      }
    }
  }
}));