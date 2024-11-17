import { AnswersGridProps } from '@/types/components.props.types';
import { motion } from 'framer-motion';

const colors = ['bg-red-500', 'bg-blue-500', 'bg-yellow-500', 'bg-green-500']

export function AnswersGrid({ currentQuestion, handleAnswer, showResult }: AnswersGridProps) {
  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {currentQuestion.answers.map((answer, index) => (
        <motion.button
          key={index}
          className={`${colors[index]} text-white text-xl font-bold py-8 px-4 rounded-lg shadow-lg hover:opacity-90 transition-opacity`}
          onClick={() => handleAnswer(index)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={showResult}
        >
          {answer}
          {showResult && index === currentQuestion.correctAnswer && (
            <span className="ml-2">✅</span>
          )}
        </motion.button>
      ))}
    </div>
  )
}