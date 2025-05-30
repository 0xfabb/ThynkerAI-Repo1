"use client";

import { LoggedNav } from "@/components/LoggedNav";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import Markdown from "react-markdown";



export default function StudyPage() {
  const [chats, setChats] = useState([
    { id: 1, title: "Math Doubts", messages: [
      { role: "user", content: "What is the Pythagorean theorem?" },
      { role: "ai", content: "The Pythagorean theorem states that..." },
    ] },
    { id: 2, title: "Physics Revision", messages: [] },
  ]);
  const [activeChat, setActiveChat] = useState<number>(chats[0]?.id || 1);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const getActiveChat = () => chats.find(chat => chat.id === activeChat);

  const handleNewChat = () => {
    const newId = chats.length ? Math.max(...chats.map(c => c.id)) + 1 : 1;
    const newChat = { id: newId, title: `New Chat ${newId}`, messages: [] };
    setChats([newChat, ...chats]);
    setActiveChat(newId);
    setSidebarOpen(false);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    setLoading(true);

    // Add user message
    setChats(prev =>
      prev.map(chat =>
        chat.id === activeChat
          ? { ...chat, messages: [...chat.messages, { role: "user", content: input }] }
          : chat
      )
    );
    setInput("");

    try {
      const response = await axios.post("/api/graphs", {
        question: input,
      });
      const data = response.data;
      const markdownAnswer =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No answer found.";
      const answerText = markdownAnswer;
      
      setChats(prev =>
        prev.map(chat =>
          chat.id === activeChat
            ? { ...chat, messages: [...chat.messages, { role: "ai", content: answerText }] }
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
