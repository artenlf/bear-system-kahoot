import { useGameStore } from '@/store/gameStore';
import { useEffect } from 'react';

export const useGameTimer = () => {
  const { isLoading, setLoading } = useGameStore();

  useEffect(() => {
    if (!isLoading) {
      return setLoading(false);
    }
  }, [isLoading, setLoading]);
};