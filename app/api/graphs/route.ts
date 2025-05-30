import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";
import { databases } from "../../../lib/appwrite";
import { ID, Query } from "appwrite";


const model = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_KEY,
});

interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

const databaseId = "68386ec6003455f0d900";
const collectionId = "6839b212003447bee532";


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, userId, docId, initial } = body;


    // If this is a new chat, create a new document and return its id
    if (initial) {
      const created = await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        {
          userId,
          Chat: JSON.stringify([]), // always use Chat
        }
      );
      return NextResponse.json({ docId: created.$id });
    }


    // 1. Generate AI response
    const response = await model.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: question }] }],
    });
    const aiText = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";


    let chatData: ChatMessage[] = [];
    let usedDocId = docId;


    if (!docId) {
      // New chat: create document with first Q&A
      chatData = [
        { role: "user", content: question },
        { role: "ai", content: aiText },
      ];
      const created = await databases.createDocument(
        databaseId,
        collectionId,
        ID.unique(),
        { Chat: JSON.stringify(chatData), userId }
      );
      usedDocId = created.$id;
    } else {
      // Existing chat: fetch, append, and update
      let doc;
      try {
        doc = await databases.getDocument(databaseId, collectionId, docId);
        chatData = doc && doc.Chat ? JSON.parse(doc.Chat) : [];
      } catch {
        chatData = [];
      }
      chatData.push({ role: "user", content: question });
      chatData.push({ role: "ai", content: aiText });
      await databases.updateDocument(
        databaseId,
        collectionId,
        docId,
        { Chat: JSON.stringify(chatData), userId }
      );
    }


    return NextResponse.json({
      success: true,
      chatData,
      docId: usedDocId,
      aiResponse: aiText,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }
  const docs = await databases.listDocuments(
    databaseId,
    collectionId,
    [Query.equal("userId", userId)]
  );
  return NextResponse.json({ chats: docs.documents });
}


