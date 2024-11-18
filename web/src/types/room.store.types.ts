import { Player } from "./player.types";
import { QuizRoom } from "./room.types";

export interface RoomManagerStore {
  activeRoom: QuizRoom | null;
  participants: Player[];
  createRoom: (hostId: string) => Promise<string>;
  joinRoom: (roomId: string, player: Player) => Promise<() => void>;
  exitRoom: (roomId: string, playerId: string) => Promise<void>;
  beginQuiz: (roomId: string) => Promise<boolean>;
  finishQuiz: (roomId: string) => Promise<(() => void) | undefined>;
  submitAnswer: (roomId: string, playerId: string, answerIndex: number) => Promise<void>;
  nextQuestion: (roomId: string) => Promise<void>;
  resetRoom: () => void;
}