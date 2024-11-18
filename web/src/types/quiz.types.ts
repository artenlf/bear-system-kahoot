export interface Question {
  id: number;
  question: string;
  answers: string[];
  correctAnswer: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  timeRemaining: number;
  score: number;
  showResultScreen: boolean;
  questions: Question[];
  isComplete: boolean;
  hasAnswered: boolean;
  isLoading: boolean;
  timer: NodeJS.Timer | null;
}