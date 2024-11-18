import { useAuthStore } from '@/store/authStore';
import { useRoomStore } from '@/store/roomStore';
import { useState } from 'react';

export const CreateGame = () => {
  const { user } = useAuthStore();
  const { createRoom } = useRoomStore();
  const [roomId, setRoomId] = useState('');

  const handleCreate = async () => {
    if (user) {
      const newRoomId = await createRoom(user.uid);
      setRoomId(newRoomId);
    }
  };

  return (
    <div>
      <button onClick={handleCreate}>Criar uma sala</button>
      {roomId && <p>ID da sala: {roomId}</p>}
    </div>
  );
};