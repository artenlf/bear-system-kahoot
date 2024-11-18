'use client'

import { AnswersGrid } from '@/components/AnswersGrid'
import GameResults from '@/components/GameResults'
import { QuestionBox } from '@/components/QuestionBox'
import { Scoreboard } from '@/components/Scoreboard'
import { Timer } from '@/components/Timer'
import { useAuthStore } from '@/store/authStore'
import { useGameStore } from '@/store/gameStore'
import { useRoomStore } from '@/store/roomStore'
import { useEffect, useState } from 'react'

export default function SabeTudoGameHome() {
  const {
    currentQuestionIndex,
    timeRemaining,
    score,
    showResultScreen,
    isComplete,
    handleAnswer,
    isLoading,
    hasAnswered,
    startTimer,
    stopTimer,
  } = useGameStore();

  const { activeRoom, joinRoom } = useRoomStore();
  const { user } = useAuthStore();

  const [waitingForOthers, setWaitingForOthers] = useState(false);

  // Effect for initializing room connection and handling cleanup
  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const initRoom = async () => {
      if (activeRoom?.id && user) {
        cleanup = await joinRoom(activeRoom.id, {
          id: user.uid,
          name: user.displayName || 'Anônimo',
          score: 0,
          disconnected: false
        });
      }
    };

    initRoom();

    return () => {
      if (cleanup) cleanup();
      stopTimer();
    };
  }, [activeRoom?.id, user, joinRoom, stopTimer]);

  // Effect for handling waiting state
  useEffect(() => {
    if (hasAnswered && activeRoom) {
      setWaitingForOthers(true);
    }
  }, [hasAnswered, activeRoom]);

  // Effect for handling ready state
  useEffect(() => {
    if (activeRoom?.readyForNext) {
      setWaitingForOthers(false);
    }
  }, [activeRoom?.readyForNext]);

  // Effect for timer management
  useEffect(() => {
    if (!isLoading && !showResultScreen) {
      startTimer();
      return () => stopTimer();
    }
  }, [isLoading, showResultScreen, startTimer, stopTimer]);

  // Effect for syncing the current question index between room and local game state
  useEffect(() => {
    if (activeRoom?.currentQuestionIndex !== undefined) {
      useGameStore.getState().setQuestionIndex(activeRoom.currentQuestionIndex);
    }
  }, [activeRoom?.currentQuestionIndex]);

  // Effect for handling game state transitions based on room status
  useEffect(() => {
    if (activeRoom?.status === 'playing') {
      useGameStore.getState().setLoading(false);
      useGameStore.getState().setQuestionIndex(activeRoom.currentQuestionIndex);
    }

    if (activeRoom?.status === 'finished') {
      useGameStore.getState().setComplete(true);
    }
  }, [activeRoom?.status, activeRoom?.currentQuestionIndex]);

  if (!activeRoom?.questions || !user) {
    return <div>Loading...</div>
  }

  if (waitingForOthers) {
    return (
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg text-center">
          <h2 className="text-xl font-bold mb-4">Aguardando outros jogadores...</h2>
          <div className="animate-pulse">⏳</div>
        </div>
      </div>
    );
  }

  if (isComplete && activeRoom) {
    return <GameResults />
  }

  const currentQuestion = activeRoom?.questions?.[currentQuestionIndex]

  if (!currentQuestion) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between mb-8">
          <Scoreboard score={score} />
          <Timer timeLeft={timeRemaining} />
        </div>

        <QuestionBox
          currentQuestion={currentQuestion}
          timeLeft={timeRemaining}
          isLoading={isLoading}
          handleAnswer={handleAnswer}
          showResult={showResultScreen}
        />

        <AnswersGrid
          currentQuestion={currentQuestion}
          handleAnswer={handleAnswer}
          showResult={showResultScreen}
        />
      </div>
    </div>
  )
}