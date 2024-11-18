import { Trophy } from '@/components/GameResults/components/Podium/Trophy';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ResultItemProps } from '@/types/components.props.types';
import { motion } from 'framer-motion';

export function ResultItem({ result, index, isCurrentUser }: ResultItemProps) {
  return (
    <motion.div
      className={`flex items-center ${isCurrentUser ? 'bg-blue-50 border-2 border-blue-500' : 'bg-secondary'
        } rounded-lg p-4`}
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay: index * 0.1 }}
    >
      <span className="text-2xl font-bold mr-4 w-8 text-center">{index + 1}</span>
      <Avatar className="h-12 w-12 mr-4 border-2 border-purple-500">
        <AvatarFallback>{result.name.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-grow flex justify-between">
        <h3 className="text-2xl font-semibold">{result.name}</h3>
        <p className="text-xl font-bold">{result.score} pts</p>
      </div>
      {index < 3 && <Trophy position={index + 1} />}
    </motion.div>
  );
}