import { useAuthStore } from '@/store/authStore';
import { useRoomStore } from '@/store/roomStore';
import { GameStore } from '@/types/game.store.types';
import { QuizState } from '@/types/quiz.types';
import { create } from 'zustand';

const INITIAL_STATE: QuizState = {
  currentQuestionIndex: 0,
  timeRemaining: 20,
  score: 0,
  showResultScreen: false,
  questions: [],
  isComplete: false,
  hasAnswered: false,
  isLoading: true,
  timer: null as NodeJS.Timeout | null
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  setAnswered: (answered: boolean) => {
    set({ hasAnswered: answered });
  },

  startTimer: () => {
    const { timer } = get();
    if (timer) {
      clearInterval(timer as NodeJS.Timeout);
    }
    set({ timeRemaining: 20 });
    const newTimer = setInterval(() => {
      get().decrementTimer();
    }, 1000);
    set({ timer: newTimer });
  },

  decrementTimer: () => {
    const { timeRemaining, hasAnswered, isLoading, timer } = get();

    if (hasAnswered || isLoading || !timer) return;

    if (timeRemaining > 0) {
      set((state) => ({ timeRemaining: state.timeRemaining - 1 }));
    } else {
      get().handleAnswer(-1);
      get().stopTimer();
    }
  },

  stopTimer: () => {
    const { timer } = get();
    if (timer) {
      clearInterval(timer as NodeJS.Timeout);
      set({
        timer: null,
        timeRemaining: 20,
        hasAnswered: false
      });
    }
  },

  handleAnswer: async (answerIndex: number) => {
    const { currentQuestionIndex, hasAnswered } = get();
    const { activeRoom } = useRoomStore.getState();
    const { user } = useAuthStore.getState();

    if (hasAnswered || !activeRoom || !user) return;

    try {
      const currentQuestion = activeRoom.questions[currentQuestionIndex];
      if (!currentQuestion) return;

      set((state) => ({
        ...state,
        hasAnswered: true,
        showResultScreen: true,
        score: answerIndex === currentQuestion.correctAnswer ? state.score + 1 : state.score
      }));

      await useRoomStore.getState().submitAnswer(
        activeRoom.id,
        user.uid,
        answerIndex
      );

    } catch (error) {
      console.error('Error handling answer:', error);
    }
  },

  setQuestionIndex: (index: number) => {
    set((state) => ({
      ...state,
      currentQuestionIndex: index,
      timeRemaining: 20,
      hasAnswered: false,
      showResultScreen: false
    }));
  },

  handleNextQuestion: () => {
    const { currentQuestionIndex, timer } = get();
    const { activeRoom } = useRoomStore.getState();

    if (!activeRoom) return;

    if (timer) {
      clearInterval(timer as NodeJS.Timeout);
      set({ timer: null });
    }

    if (currentQuestionIndex < activeRoom.questions.length - 1) {
      set((state) => ({
        ...state,
        timeRemaining: 20,
        showResultScreen: false,
        hasAnswered: false,
        isLoading: true
      }));

      useRoomStore.getState().nextQuestion(activeRoom.id);

      setTimeout(() => {
        set({ isLoading: false });
        get().startTimer();
      }, 1000);
    } else {
      set({ isComplete: true });
      useRoomStore.getState().finishQuiz(activeRoom.id);
    }
  },

  setComplete: (complete: boolean) => {
    set({ isComplete: complete });
  },

  resetGame: () => {
    const { timer } = get();
    if (timer) {
      clearInterval(timer as NodeJS.Timeout);
    }
    set(INITIAL_STATE);
    setTimeout(() => {
      set({ isLoading: false });
    }, 1000);
  }
}));