import { motion } from 'framer-motion'


export function Timer({ timeLeft }: { timeLeft: number }) {

  return (
    <div className='flex flex-col items-center gap-4'>
      <h2 className='text-white text-2xl font-bold'>Tempo restante</h2>
      <motion.div
        className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold ${timeLeft <= 5
          ? 'bg-red-500 text-white'
          : timeLeft <= 10
            ? 'bg-yellow-500 text-white'
            : 'bg-white text-slate-700'
          }`}
        animate={{
          scale: timeLeft <= 5 ? [1, 1.1, 1] : 1,
        }}
        transition={{
          duration: 0.5,
          repeat: timeLeft <= 5 ? Infinity : 0,
          repeatType: "reverse"
        }}
      >
        {timeLeft}
      </motion.div>
    </div>
  )
}