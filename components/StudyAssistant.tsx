"use client";

import React, { useState } from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export const StudyAssistant = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    setLoading(true);
    setAnswer(null);

    try {
      const response = await axios.post("/api/graphs", {
        question: question,
      });
      const data = response.data;
      // Extract the answer text from Gemini API response
      const answerText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text || "No answer found.";
      setAnswer(answerText);
	  setLoading(false);
	  setQuestion("")
    } catch (error) {
      console.error("Error fetching answer:", error);
      setAnswer("Sorry, there was an error processing your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-xl w-full mx-auto my-8 shadow-lg border border-primary/10 bg-white/90">
      <CardHeader>
        <CardTitle className="text-xl font-bold mb-2 text-primary flex items-center gap-2">
          <span role="img" aria-label="Assistant">
            🎓
          </span>{" "}
          Ask StudyAI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            className="flex-1"
            placeholder="Ask a question or paste your assignment..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
          />
          <Button onClick={handleAsk} disabled={loading || !question}>
            {loading ? "Thinking..." : "Ask"}
          </Button>
        </div>
        {answer && (
          <div className="bg-muted/60 rounded p-4 mt-2 text-base text-foreground border border-muted prose max-w-none">
            <ReactMarkdown>{answer}</ReactMarkdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
