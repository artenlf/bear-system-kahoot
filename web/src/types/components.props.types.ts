import { Question } from "./quiz.types";
import { GameResult } from "./room.types";

export interface QuestionBoxProps {
  currentQuestion: Question;
  timeLeft: number;
  isLoading?: boolean;
  handleAnswer: (answerIndex: number) => void;
  showResult: boolean;
}

export interface AnswersGridProps {
  currentQuestion?: Question;
  handleAnswer: (index: number) => void;
  showResult: boolean;
}

export interface TimerProps {
  timeLeft: number;
  maxTime?: number;
}

interface Result {
  name: string;
  score: number;
}

export interface ResultItemProps {
  result: Result;
  index: number;
  isCurrentUser: boolean;
}

export interface ResultsListProps {
  results: GameResult[];
  currentUserId: string;
}