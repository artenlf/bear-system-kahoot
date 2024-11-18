'use client'

import { useGameStore } from '@/store/gameStore'
import { useRouter } from 'next/navigation'

export default function GameStart() {
  const router = useRouter()
  const { resetGame } = useGameStore()

  const handleStartGame = () => {
    resetGame()
    router.push('/game')
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center text-center p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4">Vamos começar um novo jogo?</h2>
      <button
        onClick={handleStartGame}
        className="bg-green-400 text-white text-xl font-bold px-10 py-4 rounded hover:bg-green-500"
      >
        Jogar
      </button>
    </div>
  )
}