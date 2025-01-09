export interface QuestionChoice {
  id: string;
  answer: string;
  isCorrect: boolean;
  explanation: string;
}

export default interface Question {
  question: string;
  answerChoices: QuestionChoice[];
}
