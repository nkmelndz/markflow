import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { instruction, context } = await req.json();

    if (!instruction) {
      return NextResponse.json(
        { error: 'Instruction is required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { generatedText: "Error: GEMINI_API_KEY is not configured in .env.local" },
        { status: 200 }
      );
    }

    // Config for model
    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

const systemPrompt = `You are an expert Markdown and Marp editor assistant used in 'Markflow'.
Your goal is to help the user edit, refactor, or generate content.
You will receive the CURRENT FULL CONTENT of the file and an INSTRUCTION.
You must return the NEW FULL CONTENT of the file after applying the instruction.
DO NOT return only the modified part. RETURN THE COMPLETE FILE.
DO NOT wrap the output in markdown code blocks unless the file itself contains code blocks.
DO NOT add conversational fillers like "Here is the updated file". Output only the raw file content.`;

    const result = await model.generateContent(`${systemPrompt}

Current Content:
${context}

Instruction:
${instruction}`);
    const response = await result.response;
    const generatedText = response.text();

    return NextResponse.json({ generatedText });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error processing request' },
      { status: 500 }
    );
  }
}
