'use client'

import { AnswersGrid } from '@/components/AnswersGrid'
import { GameOver } from '@/components/GameOver'
import { QuestionBox } from '@/components/QuestionBox'
import { Scoreboard } from '@/components/Scoreboard'
import { Timer } from '@/components/Timer'
import { useGameTimer } from '@/hooks/useGameTimer'
import { useGameStore } from '@/store/gameStore'

export default function KahootGameHome() {
  const {
    currentQuestion,
    timeLeft,
    score,
    showResult,
    isGameOver,
    questions,
    handleAnswer
  } = useGameStore()

  useGameTimer()

  if (isGameOver) {
    return <GameOver />
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        <div className="flex justify-between mb-8">
          <Scoreboard score={score} />
          <Timer timeLeft={timeLeft} />
        </div>

        <QuestionBox
          question={{
            questions,
            currentQuestion,
            timeLeft
          }}
        />

        <AnswersGrid
          currentQuestion={currentQuestion}
          handleAnswer={handleAnswer}
          showResult={showResult}
        />
      </div>
    </div>
  )
}