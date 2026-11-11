import { NextRequest, NextResponse } from 'next/server';
import { currentUser } from '@/lib/session';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { generationError } from '@/lib/generation-error';

export async function POST(request: NextRequest) {
  if (!await currentUser()) return NextResponse.json({ message: 'Please sign in to generate text.' }, { status: 401 });
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ message: 'AI text generation is temporarily unavailable.' }, { status: 503 });

  let data: unknown;
  try { data = await request.json(); }
  catch { return NextResponse.json({ message: 'Send a valid text prompt.' }, { status: 400 }); }
  const prompt = data && typeof data === 'object' && 'prompt' in data ? data.prompt : undefined;
  if (typeof prompt !== 'string' || !prompt.trim() || prompt.length > 8000) {
    return NextResponse.json({ message: 'Enter a prompt of up to 8000 characters.' }, { status: 400 });
  }

  try {
    const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
      model: process.env.GEMINI_MODEL || 'gemini-flash-lite-latest',
    });
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt.trim() }] }],
      generationConfig: { temperature: 1, topP: 0.95, topK: 64, maxOutputTokens: 8192, responseMimeType: 'text/plain' },
    });
    const text = result.response.text();
    if (!text.trim()) return NextResponse.json({ message: 'No text was generated. Please try another prompt.' }, { status: 422 });
    return NextResponse.json({ response: text });
  } catch (error) {
    // Never return raw provider errors: they can contain internal request details.
    const failure = generationError(error);
    return NextResponse.json({ message: failure.message }, { status: failure.status });
  }
}
