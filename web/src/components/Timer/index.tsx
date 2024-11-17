import { motion } from 'framer-motion';

interface TimerProps {
  timeLeft: number;
  maxTime?: number;
}

export function Timer({ timeLeft, maxTime = 20 }: TimerProps) {
  const percentage = (timeLeft / maxTime) * 100;
  const isWarning = timeLeft <= 10;
  const isDanger = timeLeft <= 5;

  return (
    <div className='flex flex-col items-center gap-4'>
      <h2 className='text-white text-2xl font-bold'>Tempo restante</h2>
      <div className="relative">
        <motion.div
          className={`w-24 h-24 rounded-full flex items-center justify-center text-4xl font-bold
            ${isDanger
              ? 'bg-red-500 text-white'
              : isWarning
                ? 'bg-yellow-500 text-white'
                : 'bg-white text-slate-700'
            }`}
          animate={{
            scale: isDanger ? [1, 1.1, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: isDanger ? Infinity : 0,
            repeatType: "reverse"
          }}
        >
          {timeLeft}
        </motion.div>
        <motion.div
          className="absolute inset-0"
          style={{
            background: `conic-gradient(
              ${isDanger ? '#ef4444' : isWarning ? '#eab308' : '#fff'} ${percentage}%, 
              transparent ${percentage}%
            )`,
            borderRadius: '100%',
            rotate: '-90deg',
            zIndex: -1
          }}
        />
      </div>
    </div>
  )
}