import { useGameStore } from '@/store/gameStore'
import React from 'react'

export const GameOver: React.FC = () => {
  const { score, questions, resetGame } = useGameStore()

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex flex-col items-center justify-center text-center p-8 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-4">Fim de Jogo!</h2>
      <div className='flex flex-col'>
        <p className="text-xl mb-4">
          Sua pontuação: {''}
          <span className="text-3xl font-bold text-white">{score}/{questions.length}</span>
        </p>
      </div>
      <button
        onClick={resetGame}
        className="bg-green-400 text-white text-xl font-bold px-10 py-4 rounded hover:bg-green-500"
      >
        Jogar Novamente
      </button>
    </div>
  )
}