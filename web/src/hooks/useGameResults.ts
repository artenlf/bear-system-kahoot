import { useAuthStore } from '@/store/authStore';
import { useRoomStore } from '@/store/roomStore';
import { calculateResults, checkAllPlayersComplete } from '@/utils/resultCalculations';
import confetti from 'canvas-confetti';
import { useEffect, useState } from 'react';

export function useGameResults() {
  const { user } = useAuthStore();
  const { activeRoom, participants } = useRoomStore();
  const [loading, setLoading] = useState(true);
  const [showRanking, setShowRanking] = useState(false);
  const [showPodium, setShowPodium] = useState(false);

  useEffect(() => {
    if (!activeRoom?.questions || !participants?.length) {
      setLoading(false);
      return;
    }

    const allComplete = checkAllPlayersComplete(activeRoom, participants);
    setLoading(false);

    const triggerConfetti = () => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    };

    if (allComplete && activeRoom.status === 'finished') {
      const timer = setTimeout(() => {
        setShowRanking(true);
        triggerConfetti();
        setTimeout(() => setShowPodium(true), 1000);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [activeRoom, participants]);

  const results = activeRoom && participants ?
    calculateResults(activeRoom, participants) : [];

  return {
    loading,
    showRanking,
    showPodium,
    results,
    user,
    activeRoom
  }
}