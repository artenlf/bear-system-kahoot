import { QuestionBoxProps } from '@/types/components.props.types';
import { motion } from 'framer-motion';

export function QuestionBox({ currentQuestion, timeLeft, isLoading = true }: QuestionBoxProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="w-full bg-gray-200 rounded-full h-4"></div>
        </div>
      </div>
    );
  }

  const question = currentQuestion?.question;

  if (!question) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-black text-3xl font-bold text-center mb-4">
        {question}
      </h2>
      <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
        <motion.div
          className={`h-4 rounded-full ${timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-500' : 'bg-green-500'}`}
          initial={{ width: '100%' }}
          animate={{ width: `${(timeLeft / 20) * 100}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}