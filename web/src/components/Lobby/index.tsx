'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useRoomStore } from "@/store/roomStore";
import { useRouter } from "next/navigation";

export default function Lobby() {
  const router = useRouter();
  const { activeRoom, participants, beginQuiz, exitRoom } = useRoomStore();
  const { user } = useAuthStore();
  const isHost = activeRoom?.hostId === user?.uid;

  const handleLeave = async () => {
    if (activeRoom && user) {
      await exitRoom(activeRoom.id, user.uid);
      router.push('/menu');
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2">ID da sala</h2>
        <div className="text-4xl font-bold tracking-wider bg-gray-100 rounded-lg py-2 animate-pulse">
          {activeRoom?.id}
        </div>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-3">Jogadores ({participants.length}/8)</h3>
        <div className="grid grid-cols-2 gap-4">
          {participants.map((participant) => (
            <div key={participant.id} className="flex items-center gap-2 bg-gray-100 rounded-lg p-2 animate-bounce">
              <Avatar>
                <AvatarFallback>{participant.name.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{participant.name}</span>
            </div>
          ))}
          {Array.from({ length: 8 - participants.length }).map((_, index) => (
            <div key={`empty-${index}`} className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
              <Avatar>
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <span className="font-medium text-gray-400">Aguardando...</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between">
        <Button
          onClick={handleLeave}
          variant="outline"
          className="px-6"
        >
          Sair da sala
        </Button>
        {isHost && (
          <button
            onClick={() => activeRoom && beginQuiz(activeRoom.id)}
            disabled={participants.length < 2}
          >
            Start Game
          </button>
        )}
      </div>
      <div className="flex justify-center">
        <Button onClick={handleLeave} variant="outline" className="w-full">
          Sair da sala
        </Button>
      </div>
    </div>
  )
}