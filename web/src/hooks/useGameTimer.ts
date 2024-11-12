import { useGameStore } from '@/store/gameStore'
import { useEffect } from 'react'

export const useGameTimer = () => {
  const { timeLeft, showResult, handleNextQuestion, updateGameState } = useGameStore()

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => {
        updateGameState({ timeLeft: timeLeft - 1 })
      }, 1000)

      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !showResult) {
      handleNextQuestion()
    }
  }, [timeLeft, showResult, handleNextQuestion, updateGameState])
}