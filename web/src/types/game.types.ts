export interface Question {
  id: number
  question: string
  answers: string[]
  correctAnswer: number
}

export interface GameState {
  currentQuestion: number
  timeLeft: number
  score: number
  showResult: boolean
  questions: Question[]
  isGameOver: boolean
}