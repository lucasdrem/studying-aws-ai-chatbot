export default function InitialMessage() {
  return (
    <div className="w-full bg-background shadow-sm border rounded-lg p-4 flex flex-col gap-2">
      <h1 className="font-bold">Welcome to the AWS Certification Quiz! 🎉</h1>
      <p className="text-muted-foreground text-sm">
        Hi there! Ready to sharpen your skills and ace the AWS Certified exam?
        💻✨
        <br />
        Here’s what you can expect:
      </p>

      <ul className="text-muted-foreground text-sm list-disc list-inside">
        <li>
          <strong>Interactive Case Studies</strong>: Solve realistic AWS
          certification exam questions.
        </li>
        <li>
          <strong>Dynamic Question Types</strong>: Test your knowledge with a
          mix of multiple-choice and open-ended questions.
        </li>
        <li>
          <strong>Personalized Feedback</strong>: Get instant explanations to
          strengthen your understanding.
        </li>
        <li>
          <strong>Progress Tracking</strong>: Monitor your score and improvement
          as you go.
        </li>
      </ul>

      <p className="text-muted-foreground text-sm">
        Let’s start with your first question! 🚀
      </p>
    </div>
  );
}
