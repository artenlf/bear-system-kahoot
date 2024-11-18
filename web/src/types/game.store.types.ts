import { QuizState } from "./quiz.types";

export interface GameStore extends QuizState {
  setLoading: (loading: boolean) => void;
  setQuestionIndex: (index: number) => void;
  setAnswered: (answered: boolean) => void;
  handleAnswer: (answerIndex: number) => void;
  handleNextQuestion: () => void;
  setComplete: (complete: boolean) => void;
  resetGame: () => void;
  decrementTimer: () => void;
  startTimer: () => void;
  stopTimer: () => void;
}