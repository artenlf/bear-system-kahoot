import { fallbackQuestions } from "@/fallbackQuestions";
import { Question } from "@/types/quiz.types";

const recentlyUsedQuestions = new Set<number>();
const MAX_RECENT_TRACKED = 20;

function fisherYatesShuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function generateQuizQuestions(amount: number = 10): Promise<Question[]> {
  let availableQuestions = [...fallbackQuestions];
  for (let i = 0; i < 3; i++) {
    availableQuestions = fisherYatesShuffle(availableQuestions);
  }

  availableQuestions = availableQuestions.filter(q => !recentlyUsedQuestions.has(q.id));

  if (availableQuestions.length < amount) {
    recentlyUsedQuestions.clear();
    availableQuestions = [...fallbackQuestions];
    availableQuestions = fisherYatesShuffle(availableQuestions);
  }

  const selectedQuestions = availableQuestions.slice(0, amount);
  selectedQuestions.forEach(q => {
    recentlyUsedQuestions.add(q.id);
    if (recentlyUsedQuestions.size > MAX_RECENT_TRACKED) {
      const value = recentlyUsedQuestions.values().next().value;
      if (value !== undefined) {
        recentlyUsedQuestions.delete(value);
      }
    }
  });

  return selectedQuestions.map((q, index) => {
    const answers = fisherYatesShuffle(q.answers);
    const correctAnswerIndex = answers.indexOf(q.answers[q.correctAnswer]);
    return {
      id: index + 1,
      question: q.question,
      answers,
      correctAnswer: correctAnswerIndex
    };
  });
}