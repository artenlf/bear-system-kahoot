'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useGameResults } from "@/hooks/useGameResults"
import { useGameStore } from "@/store/gameStore"
import { useRoomStore } from "@/store/roomStore"
import { motion } from 'framer-motion'
import { useRouter } from "next/navigation"
import { LoadingResults } from "./components/LoadingResults"
import { StandardPodium, TwoPlayersPodium } from "./components/Podium"
import { ResultsList } from "./components/ResultsList"


export default function GameResults() {
  const router = useRouter();
  const {
    loading,
    showRanking,
    showPodium,
    results,
    user,
    activeRoom
  } = useGameResults();

  const handlePlayAgain = async () => {
    try {
      useGameStore.getState().resetGame();
      await useRoomStore.getState().resetRoom();
      router.push('/game/menu');
    } catch (error) {
      console.error('Error resetting game:', error);
    }
  };

  if (loading || !activeRoom || !user) return null;

  if (!showRanking) {
    return (
      <LoadingResults
        finishedCount={results.length}
        totalCount={activeRoom.initialParticipantCount}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl">
        <CardContent className="p-6">
          <h1 className="text-4xl font-bold text-center mb-12 text-purple-600">
            Ranking Final 🏆
          </h1>

          {showPodium && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {results.length === 2 ? (
                <TwoPlayersPodium players={results} />
              ) : (
                <StandardPodium players={results.slice(0, 3)} />
              )}
            </motion.div>
          )}

          <ResultsList results={results} currentUserId={user.uid} />

          <div className="mt-8 text-center">
            <Button
              onClick={handlePlayAgain}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold py-6 px-6 rounded-full text-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 shadow-lg"
            >
              Jogar Novamente 🎮
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}