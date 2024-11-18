import { Player } from "./player.types";

export interface LobbyProps {
  roomCode: string;
  participants: Player[];
  activePlayer: Player;
  onExit: () => void;
}

export interface CreateRoomProps {
  onRoomCreated: (roomCode: string) => void;
}

export interface JoinRoomProps {
  onRoomJoined: (roomCode: string) => void;
}