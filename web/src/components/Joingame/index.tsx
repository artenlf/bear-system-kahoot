import { useAuthStore } from '@/store/authStore';
import { useRoomStore } from '@/store/roomStore';
import { useState } from 'react';

export const JoinGame = () => {
  const { user } = useAuthStore();
  const { joinRoom } = useRoomStore();
  const [roomId, setRoomId] = useState('');

  const handleJoin = async () => {
    if (user && roomId) {
      const player = {
        id: user.uid,
        name: user.displayName || 'Anônimo',
        score: 0,
        disconnected: false
      };
      await joinRoom(roomId, player);
    }
  };

  return (
    <div>
      <input
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Digite o ID da sala"
      />
      <button onClick={handleJoin}>Entrar em uma sala</button>
    </div>
  );
};