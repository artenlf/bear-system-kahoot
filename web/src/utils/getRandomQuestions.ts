import { Question } from "@/types/quiz.types";

export function getRandomQuestions(questions: Question[], amount: number): Question[] {
  return [...questions]
    .sort(() => Math.random() - 0.5)
    .slice(0, amount)
    .map((q, index) => ({
      id: q.id || index + 1,
      question: q.question,
      answers: q.answers,
      correctAnswer: q.correctAnswer
    }));
}