export interface Player {
  id: string;
  name: string;
  score: number;
  disconnected: boolean;
}

export interface PlayerAnswer {
  playerId: string;
  questionId: number;
  isCorrect: boolean;
  answeredAt: number;
}