import { motion } from 'framer-motion'

export function Scoreboard({ score }: { score: number }) {
  return (
    <div className='flex flex-col items-center gap-4'>
      <h2 className='text-white text-2xl font-bold'>Pontuação</h2>
      <motion.div
        className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="absolute inset-2 bg-slate-500 rounded-full flex items-center justify-center">
          <span className="text-3xl font-bold text-white">{score}</span>
        </div>
        <motion.div
          className="absolute inset-0 border-4 border-yellow-400 rounded-full"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </div>
  )
}

