import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";


const model = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY,
});


export async function POST(req: NextRequest) {
  const body = await req.json();
  const prompt = body.question || "";
  const response = await model.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });
  return NextResponse.json(response);
}


