import { fallbackQuestions } from "@/fallbackQuestions";
import { Question } from "@/types/quiz.types";
import { getRandomQuestions } from "@/utils/getRandomQuestions";

const HUGGINGFACE_API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
const API_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";

export async function generateQuizQuestions(amount: number = 10): Promise<Question[]> {
  try {
    const prompt = `Gere ${amount} questões de múltipla escolha no seguinte formato JSON:

{
  "questions": [
    {
      "id": 1,
      "question": "Qual é a capital do Brasil?",
      "answers": ["Brasília", "Rio de Janeiro", "São Paulo", "Salvador"],
      "correctAnswer": 0
    },
    {
      "id": 2,
      "question": "Quantos continentes existem?",
      "answers": ["7", "5", "6", "8"],
      "correctAnswer": 0
    }
  ]
}

IMPORTANTE:
- Gere exatamente ${amount} questões diferentes
- Questões devem ser factuais e simples que possam ser respondidas em poucos segundos por crianças de 10 anos
- correctAnswer indica o índice da resposta correta no array answers
- Mantenha o formato JSON válido
- Use apenas conhecimentos gerais básicos
- Utilize apenas perguntas e respostas em português do Brasil
- Não utilize as perguntas exemplo acima, elas são apenas para ilustrar o formato esperado

GERE AS QUESTÕES AGORA:`;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 2048,
          temperature: 0.3,
          top_p: 0.95,
          do_sample: true,
          return_full_text: false
        }
      })
    });

    if (!response.ok) {
      console.warn('API Error, using fallback questions');
      return getRandomQuestions(fallbackQuestions, amount);
    }

    const data = await response.json();
    const generatedText = data[0]?.generated_text;

    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('Invalid JSON response, using fallback questions');
      return getRandomQuestions(fallbackQuestions, amount);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const questions: Question[] = parsed.questions.map((q: Question, index: number) => ({
      id: q.id || index + 1,
      question: q.question,
      answers: q.answers,
      correctAnswer: q.correctAnswer
    }));

    if (questions.length === 0) {
      console.warn('No questions generated, using fallback questions');
      return getRandomQuestions(fallbackQuestions, amount);
    }

    return questions;

  } catch (error) {
    console.error('Question generation error:', error);
    return getRandomQuestions(fallbackQuestions, amount);
  }
}