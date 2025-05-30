"use client";

import { useState, useRef } from "react";
import { LoggedNav } from "@/components/LoggedNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaUserCircle, FaRobot, FaBook, FaUsers, FaCrown, FaUser } from "react-icons/fa";

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<{ role: "user" | "ai"; content: string }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dummy data for previous and community doubts
  const previousDoubts = [
    { q: "What is the Pythagorean theorem?", a: "a² + b² = c²" },
    { q: "Explain Newton's second law.", a: "F = m × a" },
  ];
  const [communityDoubts, setCommunityDoubts] = useState([
    { name: "Alice", q: "What is a prime number?", a: "A number divisible only by 1 and itself.", legacy: 2 },
    { name: "Bob", q: "Define osmosis.", a: "Movement of solvent through a semipermeable membrane.", legacy: 1 },
  ]);
  const [answerModal, setAnswerModal] = useState<{ open: boolean; idx: number | null }>({ open: false, idx: null });
  const [communityAnswer, setCommunityAnswer] = useState("");
  const [legacyMsg, setLegacyMsg] = useState("");
  const [shareWithCommunity, setShareWithCommunity] = useState(false);

  const handleAsk = async () => {
    if (!question && !file) return;
    setLoading(true);
    setChat([...chat, { role: "user", content: question || (file ? `Sent file: ${file.name}` : "") }]);
    // If sharing with community, add to community doubts (simulate)
    if (shareWithCommunity && question) {
      setCommunityDoubts([
        { name: "You", q: question, a: "Awaiting answers...", legacy: 0 },
        ...communityDoubts,
      ]);
    }
    setQuestion("");
    setFile(null);
    setShareWithCommunity(false);
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = "This is a sample AI answer. Replace with real AI response.";
      setChat((prev) => [...prev, { role: "ai", content: aiResponse }]);
      setAiAnswer(aiResponse);
      setLoading(false);
    }, 1200);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSave = () => {
    // TODO: Save the question, file, and answer to the user's notebook
    alert("Saved to your Doubts Notebook!");
  };

  // Community answer modal logic
  const openAnswerModal = (idx: number) => {
    setCommunityAnswer("");
    setLegacyMsg("");
    setAnswerModal({ open: true, idx });
  };

  const submitCommunityAnswer = () => {
    if (answerModal.idx === null) return;
    const correct = communityDoubts[answerModal.idx].a.trim().toLowerCase();
    const userAns = communityAnswer.trim().toLowerCase();
    if (userAns === correct) {
      setLegacyMsg("Correct! 🎉 Legacy increased.");
      setCommunityDoubts(doubts =>
        doubts.map((d, i) =>
          i === answerModal.idx ? { ...d, legacy: (d.legacy || 0) + 1 } : d
        )
      );
    } else {
      setLegacyMsg("Incorrect. Try again!");
    }
    setCommunityAnswer("");
    setTimeout(() => setLegacyMsg(""), 2000);
  };

  return (
    <>
      <LoggedNav />
      <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto p-2 md:p-8">
        {/* Ask Doubt Section */}
        <section className="md:w-2/3 w-full bg-gray-100 rounded-2xl shadow-lg p-0 md:p-0 flex flex-col mb-4 md:mb-0 border border-neutral-700 min-h-[500px]">
          <div className="p-4 md:p-8 flex flex-col h-full">
            <h1 className="text-3xl font-bold mb-4 text-neutral-700 flex items-center gap-2">
              <FaRobot className="text-neutral-700" /> Ask a Doubt
            </h1>
            <div className="flex-1 overflow-y-auto mb-4 max-h-[400px] md:max-h-[600px] bg-white-900/80 rounded-lg p-4 border border-neutral-700">
              {chat.length === 0 && (
                <div className="text-neutral-500 text-center mt-10">Start a conversation with AI!</div>
              )}
              {chat.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex mb-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-end gap-2 max-w-[80%]`}>
                    {msg.role === "ai" && (
                      <FaRobot className="text-blue-400 text-xl mb-1" />
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl shadow-sm text-base break-words ${
                        msg.role === "user"
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-neutral-700 text-blue-100 rounded-bl-md"
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.role === "user" && (
                      <FaUserCircle className="text-blue-300 text-xl mb-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <form
              className="flex flex-col sm:flex-row gap-2 items-stretch mt-auto"
              onSubmit={e => {
                e.preventDefault();
                handleAsk();
              }}
            >
              <Input
                type="file"
                accept="image/*,.pdf"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
                disabled={loading}
              />
              <Button
                type="button"
                variant="outline"
                className="border-blue-400 text-black hover:bg-neutral-700 hover:text-white"
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
              >
                {file ? `Attached: ${file.name}` : "Upload Image or PDF"}
              </Button>
              <input
                className="flex-1 border border-neutral-700 bg-neutral-100 text-neutral-900 rounded px-3 py-2 text-base focus:outline-neutral-900"
                placeholder="Type your doubt or question..."
                value={question}
                onChange={e => setQuestion(e.target.value)}
                disabled={loading}
              />
              <Button
                type="submit"
                className=""
                disabled={loading || (!question && !file)}
              >
                {loading ? "Asking..." : "Ask"}
              </Button>
            </form>
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="share-community"
                checked={shareWithCommunity}
                onChange={() => setShareWithCommunity(v => !v)}
                className="accent-blue-600 w-4 h-4"
              />
              <label htmlFor="share-community" className="text-sm text-blue-700 cursor-pointer select-none">
                Share this doubt with the community
              </label>
            </div>
            {aiAnswer && (
              <div className="flex justify-end mt-2">
                <Button
                  className="bg-green-600 text-white hover:bg-green-700"
                  onClick={handleSave}
                >
                  Save to Doubts Notebook
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Previous & Community Doubts Section */}
        <section className="md:w-1/3 w-full flex flex-col gap-6">
          {/* Previous Doubts */}
          <div className="bg-neutral-900 rounded-2xl shadow-lg p-4 md:p-6 flex-1 mb-2 border border-neutral-700">
            <h2 className="text-xl font-semibold mb-3 text-green-300 flex items-center gap-2">
              <FaBook className="text-green-400" /> Your Previous Doubts
            </h2>
            {previousDoubts.length === 0 ? (
              <div className="text-neutral-500">No previous doubts yet.</div>
            ) : (
              <ul className="space-y-4">
                {previousDoubts.map((doubt, idx) => (
                  <li key={idx} className="border-b border-neutral-700 pb-2">
                    <div className="font-medium text-blue-100">{doubt.q}</div>
                    <div className="text-sm text-neutral-400">{doubt.a}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {/* Community Doubts */}
          <div className="bg-neutral-100 rounded-2xl shadow-lg p-4 md:p-6 flex-1 border border-neutral-700">
            <h2 className="text-xl font-semibold mb-3 text-blue-600 flex items-center gap-2">
              <FaUsers className="text-blue-600" /> Community Doubts
            </h2>
            {communityDoubts.length === 0 ? (
              <div className="text-neutral-900">No community doubts yet.</div>
            ) : (
              <ul className="space-y-4">
                {communityDoubts.map((doubt, idx) => (
                  <li key={idx} className="border-b border-neutral-900 pb-2 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-medium text-blue-900">
                        <FaUser className="text-neutral-500" />
                        <span className="font-semibold">{doubt.name}</span>
                        <span className="text-blue-900">asked:</span>
                        <span>{doubt.q}</span>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <FaCrown /> {doubt.legacy || 0}
                      </div>
                    </div>
                    <div className="text-sm text-neutral-900 mb-1">{doubt.a}</div>
                    <Button
                      size="sm"
                      className="bg-blue-700 text-white hover:bg-blue-800 w-fit"
                      onClick={() => openAnswerModal(idx)}
                    >
                      Answer
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {/* Modal for answering community doubts */}
      {answerModal.open && answerModal.idx !== null && (
        <div className="fixed inset-0 backdrop-blur-xl bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-8 w-full max-w-2xl shadow-2xl flex flex-col gap-6">
            <h3 className="text-2xl font-bold text-blue-300 mb-2">Answer the Doubt</h3>
            <div className="text-blue-100 mb-2 text-lg">
              <span className="flex items-center gap-2">
                <FaUser className="text-neutral-400" />
                <span className="font-semibold">{communityDoubts[answerModal.idx].name}</span>
                <span className="text-blue-100">asked:</span>
              </span>
              <span className="ml-8">{communityDoubts[answerModal.idx].q}</span>
            </div>
            <form
              className="flex flex-col gap-4"
              onSubmit={e => {
                e.preventDefault();
                submitCommunityAnswer();
              }}
            >
              <textarea
                className="border border-neutral-700 bg-neutral-800 text-blue-100 rounded px-3 py-2 text-base min-h-[100px] resize-y focus:outline-blue-400"
                placeholder="Type your detailed answer..."
                value={communityAnswer}
                onChange={e => setCommunityAnswer(e.target.value)}
              />
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  id="community-answer-file"
                  // You can add a ref and state if you want to handle the file
                />
                <label
                  htmlFor="community-answer-file"
                  className="bg-neutral-700 text-blue-100 px-4 py-2 rounded cursor-pointer hover:bg-neutral-800 transition"
                >
                  Attach Image
                </label>
                <Button
                  type="button"
                  className="bg-green-700 text-white hover:bg-green-800"
                  // onClick={...} // Implement notebook tagging logic
                >
                  Tag from Notebook
                </Button>
              </div>
              {legacyMsg && (
                <div className={`text-sm ${legacyMsg.startsWith("Correct") ? "text-green-400" : "text-red-400"}`}>
                  {legacyMsg}
                </div>
              )}
              <div className="flex gap-3 justify-end mt-2">
                <Button
                  type="submit"
                  className="bg-neutral-700 text-white hover:bg-neutral-800 px-6 py-2 text-lg"
                >
                  Submit
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-neutral-700 bg-neutral-100 text-neutral-900 hover:bg-neutral-200 px-6 py-2 text-lg"
                  onClick={() => setAnswerModal({ open: false, idx: null })}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
