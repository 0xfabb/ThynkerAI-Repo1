"use client";

import { LoggedNav } from "@/components/LoggedNav";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import { account } from "@/lib/appwrite";

type Message = {
  role: "user" | "ai";
  content: string;
};

type Chat = {
  id: number;
  title: string;
  messages: Message[];
  docId: string;
};

export default function StudyPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch all chats for the user
  const fetchChats = async () => {
    const userData = await account.get();
    const userId = userData.email;
    const res = await axios.get("/api/study", {
      params: { userId },
    });
    // Map documents to your chat format
    interface ApiChatDoc {
        $id: string;
        title?: string;
        Chat?: string; 
    }

    const docs: Chat[] = ((res.data.chats || []) as ApiChatDoc[]).map((doc: ApiChatDoc, idx: number): Chat => ({
        id: idx + 1,
        title: doc.title || `Chat ${idx + 1}`,
        messages: doc.Chat ? (JSON.parse(doc.Chat) as Message[]) : [], // <-- use doc.Chat
        docId: doc.$id,
    }));
    setChats(docs);
    if (docs.length > 0 && activeChat === null) {
      setActiveChat(docs[0].id);
    }
  };

  useEffect(() => {
    fetchChats();
    // eslint-disable-next-line
  }, []);

  const getActiveChat = () => chats.find(chat => chat.id === activeChat);

  const handleNewChat = async () => {
    const userData = await account.get();
    const userId = userData.email;
    await axios.post("/api/graphs", {
      userId,
      initial: true,
    });
    await fetchChats(); // Refresh chats after creating new one
    setSidebarOpen(false);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);

    // Add user message locally
    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChat
          ? { ...chat, messages: [...chat.messages, { role: "user", content: input }] }
          : chat
      )
    );
    setInput("");
    const userData = await account.get();
    const userId = userData.email;

    // Get docId for this chat
    const currentChat = chats.find(chat => chat.id === activeChat);
    const docId = currentChat?.docId || null;

    try {
      // Send docId if exists, else let backend create new doc
      const response = await axios.post("/api/study", {
        question: input,
        userId,
        docId,
      });
      const answerText = response.data.aiResponse || "No answer found.";
      const returnedDocId = response.data.docId;

      setChats(prev =>
        prev.map(chat =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: [...chat.messages, { role: "ai", content: answerText }],
                // Save docId if it was just created
                docId: chat.docId || returnedDocId,
              }
            : chat
        )
      );
    } catch {
      setChats(prev =>
        prev.map(chat =>
          chat.id === activeChat
            ? { ...chat, messages: [...chat.messages, { role: "ai", content: "Sorry, there was an error processing your request." }] }
            : chat
        )
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoggedNav />
      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside
          className={`
            bg-gray-100 border-r p-4 flex flex-col
            w-full md:w-64
            fixed md:static top-0 left-0 h-full z-40
            transition-transform duration-200
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}
        >
          <div className="flex items-center justify-between mb-4 md:hidden">
            <span className="font-bold text-lg">Chats</span>
            <button
              className="text-2xl"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >
              &times;
            </button>
          </div>
          <Button
            className="mb-4 px-4 py-2 w-full rounded bg-neutral-800 text-white hover:bg-neutral-900 transition"
            onClick={handleNewChat}
          >
            + New Chat
          </Button>
          <div className="flex-1 overflow-y-auto">
            {chats.map((chat) => (
              <div
                key={chat.id}
                className={`p-2 rounded cursor-pointer mb-2 ${
                  activeChat === chat.id
                    ? "bg-neutral-800 text-white"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => {
                  setActiveChat(chat.id);
                  setSidebarOpen(false);
                }}
              >
                {chat.title}
              </div>
            ))}
          </div>
        </aside>
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {/* Chat Area */}
        <main className="flex-1 flex flex-col bg-white relative">
          {/* Mobile sidebar toggle */}
          <div className="md:hidden flex items-center justify-between p-4 border-b">
            <button
              className="text-2xl"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              &#9776;
            </button>
            <span className="font-bold text-lg">
              {getActiveChat()?.title || "Chats"}
            </span>
            <div className="w-8" /> {/* Spacer */}
          </div>
          <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-4">
            {getActiveChat()?.messages.length === 0 && (
              <div className="text-gray-400 text-center mt-20">
                Start a conversation!
              </div>
            )}
            {getActiveChat()?.messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-lg max-w-xs md:max-w-xl break-words ${
                    msg.role === "user"
                      ? "bg-neutral-800 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {msg.role === "ai" ? (
                    <Markdown>{msg.content}</Markdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Input */}
          <form
            className="flex p-2 md:p-4 border-t bg-white sticky bottom-0"
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
          >
            <input
              className="flex-1 border rounded px-4 py-2 mr-2"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              className="px-4 py-2 rounded hover:bg-neutral-800 transition"
              disabled={loading || !input.trim()}
            >
              {loading ? "Sending..." : "Send"}
            </Button>
          </form>
        </main>
      </div>
    </>
  );
}
