import { openai } from "@ai-sdk/openai";
import { streamText, convertToCoreMessages } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const allMessages = [...messages];
  const lastMessage = allMessages.pop();

  console.info('calling openai("gpt-4o-mini")...');
  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: convertToCoreMessages([
      {
        role: "system",
        content:
          'Generate a scenario-based multiple-choice question using the AWS Certified Solutions Architect - Associate (SAA-C03) exam as reference. Guidelines: 1. Return the response in the specified JSON format only. 2. Include: * A realistic scenario requiring candidates to apply their knowledge of AWS services. * One correct answer and three plausible but incorrect options that reflect common misconceptions. * Explanations for why each option is correct or incorrect. 3. Avoid: * Simple definition questions (e.g., \'What type of storage is Amazon S3?\'). * Answers that only name a service; focus on action-oriented choices reflecting real-world decision-making. * Answers without following the JSON format structure. If the user send you to give more than 1 question, send only one with the format specified on this prompt. JSON Format: { "question": "Your scenario-based question here", "answerChoices": [ { "answer": "Option A", "isCorrect": true/false, "explanation": "Why this option is correct or incorrect." }, ... ] } Example Question: A telecommunications company is migrating its network infrastructure to AWS. Their workloads include memory-intensive operations for real-time data processing and compute-intensive tasks for analytics. How should they select appropriate EC2 instance types to optimize performance and cost? JSON Format: { "question": "How should the company select appropriate EC2 instance types?", "answerChoices": [ { "answer": "Use memory-optimized instances for memory-intensive tasks and compute-optimized instances for analytics.", "isCorrect": true, "explanation": "This aligns instance types with workload demands, optimizing performance and cost." }, ... ] }',
      },
      ...allMessages,
      ...(!!lastMessage?.content && lastMessage.role === "user"
        ? [
            {
              role: "user",
              content: `context:${lastMessage.content}\nJSON format:{"question": "","answerChoices": [{"answer": "","isCorrect": "","explanation": ""},{"answer": "","isCorrect": "","explanation": ""},{"answer": "","isCorrect": "","explanation": ""},{"answer": "","isCorrect": "","explanation": ""}]}`,
            },
          ]
        : []),
    ]),
  });

  return result.toDataStreamResponse();
}
