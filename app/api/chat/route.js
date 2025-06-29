import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const prompt = searchParams.get('prompt');
  const head = searchParams.get('head');

  if (!prompt || !head) {
    return NextResponse.json({ error: 'Missing prompt or head parameter' }, { status: 400 });
  }

  const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-flash" });

  try {
    const result = await model.generateContent([
      `You're an academic helper. Here's the topic: "${head}". Now answer the user's question: "${prompt}"`
    ]);
    const response = await result.response.text();
    return NextResponse.json({ result: response });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
