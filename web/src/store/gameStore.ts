import { questions } from '@/mockQuestions'
import { GameState } from '@/types/game.types'
import { create } from 'zustand'

interface GameStore extends GameState {
  updateGameState: (updates: Partial<GameState>) => void
  handleAnswer: (answerIndex: number) => void
  handleNextQuestion: () => void
  resetGame: () => void
}

const INITIAL_STATE: GameState = {
  currentQuestion: 0,
  timeLeft: 20,
  score: 0,
  showResult: false,
  questions,
  isGameOver: false,
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,

  updateGameState: (updates) => set((state) => ({ ...state, ...updates })),

  handleAnswer: (answerIndex) => {
    const { currentQuestion, questions, score } = get()
    const isCorrect = answerIndex === questions[currentQuestion].correctAnswer

    set((state) => ({
      ...state,
      score: isCorrect ? score + 1 : score,
      showResult: true,
    }))

    setTimeout(() => {
      get().handleNextQuestion()
    }, 2000)
  },

  handleNextQuestion: () => {
    const { currentQuestion, questions } = get()

    if (currentQuestion < questions.length - 1) {
      set((state) => ({
        ...state,
        currentQuestion: state.currentQuestion + 1,
        timeLeft: 20,
        showResult: false,
      }))
    } else {
      set((state) => ({ ...state, isGameOver: true }))
    }
  },

  resetGame: () => {
    set(INITIAL_STATE)
  },
}))