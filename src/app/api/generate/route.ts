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
    const model = genAI.getGenerativeModel({ model: "gemma-4-31b-it" });

const systemPrompt = `You are an expert Markdown and Marp editor assistant used in 'Markflow'.
Your goal is to help the user edit, refactor, or generate content.
You will receive the CURRENT FULL CONTENT of the file and an INSTRUCTION.
You must return the NEW FULL CONTENT of the file after applying the instruction.
DO NOT return only the modified part. RETURN THE COMPLETE FILE.
STRICTLY FORBIDDEN: Do NOT wrap the output in markdown code blocks (like \`\`\`markdown). Return ONLY the raw content.
IMPORTANT: Use emojis in a BALANCED way. Include them in main headers (#) and important list items to improve visual appeal, but avoid putting them in every single line.
CRITICAL FORMATTING RULES:
1. IF the user asks for "Presentation", "Slides", or "Deck":
   - YOU MUST USE MARP FORMAT (include 'marp: true' frontmatter).
   - Use "---" to separate slides.
   - Keep content concise.

2. IF the user asks for "Article", "Document", "Note", or "Blog":
   - YOU MUST USE STANDARD MARKDOWN (NO 'marp: true').
   - Do NOT use "---" for slide separation (only use it for horizontal rules if needed).
   - Focus on readability and structure.

3. General:
   - Use emojis in a BALANCED way (headers/key items).
   - Start with Marp frontmatter ONLY if it's a presentation.
   - Output ONLY the raw file content. Without markdown code blocks.

OUTPUT FORMAT (STRICT):
- Do NOT include analysis, checklists, explanations, or any text outside those markers.`;

    const extractFinalContent = (text: string) => {
      const tagMatch = text.match(/%%OUTPUT_START%%\n?([\s\S]*?)\n?%%OUTPUT_END%%/);
      if (tagMatch) {
        return tagMatch[1].trim();
      }
      return text;
    };

    const result = await model.generateContent(`${systemPrompt}

Current Content:
${context}

Instruction:
${instruction}`);
    const response = await result.response;
    const generatedText = extractFinalContent(response.text());

    return NextResponse.json({ generatedText });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Error processing request' },
      { status: 500 }
    );
  }
}
