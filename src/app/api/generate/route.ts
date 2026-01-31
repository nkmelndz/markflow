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

    // Config for model, assuming "gemini-1.5-flash" as the standard fast model
    // Using "gemini-1.5-flash" which is stable and current. 
    // If the user meant 2.0 Flash (Experimental), they can change this string.
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
System: You are an expert Markdown and Marp editor assistant used in 'Markflow'.
Your goal is to help the user edit or generate content.
Context provided below is the current file content.
Instruction is what the user wants to change or add.
Output ONLY the valid Markdown/Marp content. No conversational filler.
If the user asks for a modification, return the full modified section.

Context:
${context?.substring(0, 5000) || ''}

Instruction:
${instruction}
`;

    const result = await model.generateContent(prompt);
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
