import { Player } from "@/types/player.types";
import { GameResult, QuizRoom } from "@/types/room.types";

export function calculateResults(room: QuizRoom, participants: Player[]): GameResult[] {
  return participants
    .map(participant => {
      const uniqueAnswers = new Map();
      (room.answers || [])
        .filter(a => a.playerId === participant.id)
        .forEach(answer => {
          uniqueAnswers.set(answer.questionId, answer);
        });

      const playerAnswers = Array.from(uniqueAnswers.values());
      const correctAnswers = playerAnswers.filter(a => a.isCorrect).length;
      const totalTime = playerAnswers.reduce((sum, a) => sum + (a.answeredAt || 0), 0);
      const averageTime = playerAnswers.length > 0 ? totalTime / playerAnswers.length : 0;

      return {
        playerId: participant.id,
        name: participant.name,
        score: correctAnswers,
        correctAnswers,
        averageTime
      };
    })
    .sort((a, b) => b.score - a.score || a.averageTime - b.averageTime);
}

export function checkAllPlayersComplete(room: QuizRoom, participants: Player[]) {
  const totalQuestions = room.questions.length;
  const answers = room.answers || [];

  return participants.every(p => {
    const playerAnswers = answers.filter(a => a.playerId === p.id);
    const uniqueAnswers = new Set(playerAnswers.map(a => a.questionId));
    return uniqueAnswers.size === totalQuestions;
  });
}