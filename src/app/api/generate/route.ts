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
    // Config for model
    const model = genAI.getGenerativeModel({ model: "gemma-3-12b-it" });

const systemPrompt = `You are an expert Markdown and Marp editor assistant used in 'Markflow'.
Your goal is to help the user edit, refactor, or generate content.
You will receive the CURRENT FULL CONTENT of the file and an INSTRUCTION.
You must return the NEW FULL CONTENT of the file after applying the instruction.
DO NOT return only the modified part. RETURN THE COMPLETE FILE.
STRICTLY FORBIDDEN: Do NOT wrap the output in markdown code blocks (like \`\`\`markdown). Return ONLY the raw content.
IMPORTANT: Use emojis in a BALANCED way. Include them in main headers (#) and important list items to improve visual appeal, but avoid putting them in every single line.
CRITICAL FOR PRESENTATIONS: If the user asks for a presentation or slides, YOU MUST USE MARP FORMAT.
1. Start with the Marp frontmatter if it's a new file:
---
marp: true
theme: default
---
2. Use "---" to separate EVERY slide.
3. Ensure content fits on slides (don't make them too long).
DO NOT add conversational fillers. Output only the raw file content.`;

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
