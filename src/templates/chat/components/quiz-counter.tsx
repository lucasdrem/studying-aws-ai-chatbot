type QuizCounterProps = {
  correctAnswers: number;
  totalQuestions: number;
};

export default function QuizCounter({
  correctAnswers = 0,
  totalQuestions = 0,
}: QuizCounterProps) {
  return (
    <div className="flex flex-col gap-1 justify-center items-center w-full text-primary">
      <h6 className="text-base font-medium">Quiz Counter 🏆</h6>
      <h1 className="text-2xl font-bold">
        Correct Answers: {correctAnswers}/{totalQuestions}
      </h1>
    </div>
  );
}
