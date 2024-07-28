import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ message: 'API Key Does not Exist' }, { status: 500 });

    const data = await request.json();
    const prompt = data.prompt;

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
    });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };

    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        const result = await chatSession.sendMessage(prompt);

        return NextResponse.json({ response: result.response.text() }, { status: 200 });
    } catch (e) {
        if (e instanceof Error) {
            return NextResponse.json({ message: e.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'Unknown Error' }, { status: 500 });
    }
}
