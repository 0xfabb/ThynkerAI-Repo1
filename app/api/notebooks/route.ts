"use server";

import { NextRequest, NextResponse } from "next/server";
import { databases } from "../../../lib/appwrite";
import { ID, Query } from "appwrite";

class NoteBook {
  bookname: string;
  userId: string;

  constructor(bookname: string, userId: string) {
    this.bookname = bookname;
    this.userId = userId;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const bookname = body.bookname;
    const userId = body.email;
    const addedBook = new NoteBook(bookname, userId);

    const response = await databases.createDocument(
      "6839cdf200095f702a46",
      "6839cdff0031d021daf8",
      ID.unique(),
      addedBook
    );

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("email");
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid email parameter" },
        { status: 400 }
      );
    }
    const response = await databases.listDocuments(
      "6839cdf200095f702a46",
      "6839cdff0031d021daf8",
      [Query.equal("userId", userId)]
    );
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { $id, Content } = body;
    if (!$id) {
      return NextResponse.json(
        { success: false, error: "Missing notebook id" },
        { status: 400 }
      );
    }
    const response = await databases.updateDocument(
      "6839cdf200095f702a46", // your databaseId
      "6839cdff0031d021daf8", // your collectionId
      $id,
      { Content }
    );
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
