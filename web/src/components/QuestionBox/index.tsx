import { motion } from 'framer-motion';


interface Question {
  question: string;
}

export function QuestionBox({ question: { questions, currentQuestion, timeLeft } }: { question: { questions: Question[], currentQuestion: number, timeLeft: number } }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-black text-3xl font-bold text-center mb-4">
        {questions[currentQuestion].question}
      </h2>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
        <motion.div
          className={` h-4 rounded-full ${timeLeft <= 5
            ? 'bg-red-500'
            : timeLeft <= 10
              ? 'bg-yellow-500'
              : 'bg-green-500'
            }`}
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / 20) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  )
}