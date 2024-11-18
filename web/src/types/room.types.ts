import { Player, PlayerAnswer } from "./player.types";
import { Question } from "./quiz.types";

export interface QuizRoom {
  id: string;
  hostId: string;
  participants: Player[];
  status: 'waiting' | 'playing' | 'finished';
  currentQuestionIndex: number;
  questions: Question[];
  answers: PlayerAnswer[];
  startTime?: number;
  initialParticipantCount: number;
  readyForNext?: boolean;
  currentQuestionStartTime?: number;
}

// Room Results
export interface GameResult {
  playerId: string;
  name: string;
  score: number;
  correctAnswers: number;
  averageTime: number;
}