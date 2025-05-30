"use client";

import { useEffect, useState } from "react";
import { LoggedNav } from "@/components/LoggedNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus, FaShareAlt, FaLock, FaUnlock } from "react-icons/fa";
import axios from "axios";
import {account} from "../../../lib/appwrite"
import Image from "next/image";

type Notebook = {
  $id: string;
  bookname: string;
  Content: (string | { type: "image"; url: string })[];
  visibility: "private" | "public";
  email: string;
};

export default  function NotebooksPage() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  
  const selectedNotebook = notebooks.find((nb) => nb.$id === selectedId);

  
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userData = await account.get();
        setUserEmail(userData.email);
        console.log(userData.email);
      } catch (error) {
        console.error("Failed to fetch user email", error);
      }
    };
    fetchUserEmail();
  }, []);

  useEffect(() => {
    if (!userEmail) return;
    const fetchNotebooks = async () => {
      try {
        const res = await axios.get("/api/notebooks", {
          params: { email: userEmail },
        });
        console.log(res.data.data.documents);

        const docs = (res.data.data?.documents || []).map((doc: Notebook) => ({
          ...doc,
          Content: (() => {
            try {
              return Array.isArray(doc.Content)
                ? doc.Content
                : JSON.parse(doc.Content ?? "[]");
            } catch {
              return [];
            }
          })(),
        }));
        setNotebooks(docs);
        if (docs.length > 0) {
          setSelectedId(docs[0].$id);
        }
      } catch (error) {
        console.error("Failed to fetch notebooks", error);
      }
    };
    fetchNotebooks();
  }, [userEmail]);

  const handleAddNotebook = async () => {
    if (!newTitle.trim()) return;
    try {
      const res = await axios.post("/api/notebooks", {
        bookname: newTitle,
        Content: [],
        visibility: "private",
        email: userEmail,
      });
      const newNotebook: Notebook = res.data.data;
      setNotebooks([newNotebook, ...notebooks]);
      setSelectedId(newNotebook.$id);
      setNewTitle("");
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddContent = async () => {
    if (!selectedNotebook) return;
    const updatedContent = Array.isArray(selectedNotebook.Content) ? [...selectedNotebook.Content] : [];
    if (newContent.trim()) {
      updatedContent.push(newContent);
      setNewContent("");
    }
    if (imageUrl.trim()) {
      updatedContent.push({ type: "image", url: imageUrl });
      setImageUrl("");
    }

    try {
      // Update on Appwrite
      await axios.patch("/api/notebooks", {
        $id: selectedNotebook.$id,
        Content: JSON.stringify(updatedContent), // Convert array to string
      });
      // Update local state
      setNotebooks(
        notebooks.map((nb) =>
          nb.$id === selectedNotebook.$id
            ? { ...nb, Content: updatedContent }
            : nb
        )
      );
    } catch (error) {
      console.error("Failed to update notebook content", error);
    }
  };

  const handleVisibilityToggle = () => {
    if (!selectedNotebook) return;
    const newVisibility =
      selectedNotebook.visibility === "private" ? "public" : "private";
    setNotebooks(
      notebooks.map((nb) =>
        nb.$id === selectedNotebook.$id
          ? { ...nb, visibility: newVisibility }
          : nb
      )
    );
    // TODO: Optionally, PATCH the notebook on the server here
  };

  return (
    <>
      <LoggedNav />
      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-neutral-100 border-r p-4 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Input
              placeholder="New notebook title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1"
            />
            <Button
              onClick={handleAddNotebook}
              className="bg-neutral-800 text-white hover:bg-neutral-700"
            >
              <FaPlus />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {notebooks.map((nb) => (
              <div
                key={nb.$id}
                className={`p-2 rounded cursor-pointer mb-2 ${
                  selectedId === nb.$id
                    ? "bg-neutral-900 text-white"
                    : "hover:bg-neutral-100"
                }`}
                onClick={() => setSelectedId(nb.$id)}
              >
                <div className="flex items-center justify-between">
                  <span>{nb.bookname}</span>
                  <span className="ml-2 text-xs px-2 py-0.5 rounded bg-blue-200 text-blue-800">
                    {nb.visibility}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </aside>
        {/* Main Notebook Area */}
        <main className="flex-1 flex flex-col bg-white p-4 md:p-8">
          {selectedNotebook ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">{selectedNotebook.bookname}</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex items-center gap-1"
                    onClick={handleVisibilityToggle}
                  >
                    {selectedNotebook.visibility === "private" ? (
                      <>
                        <FaLock /> Private
                      </>
                    ) : (
                      <>
                        <FaUnlock /> Public
                      </>
                    )}
                  </Button>
                  <Button variant="outline" className="flex items-center gap-1">
                    <FaShareAlt /> Share
                  </Button>
                </div>
              </div>
              <div className="flex flex-col gap-4 mb-6">
                {(selectedNotebook?.Content?.length ?? 0) === 0 && (
                  <div className="text-neutral-700">
                    No Content yet. Start adding notes or images!
                  </div>
                )}
                {(Array.isArray(selectedNotebook?.Content) ? selectedNotebook.Content : []).map((item, idx) =>
                  typeof item === "string" ? (
                    <div
                      key={idx}
                      className="bg-neutral-100 rounded p-3 text-base"
                    >
                      {item}
                    </div>
                  ) : (
                    <Image
                      key={idx}
                      src={item.url}
                      alt="Notebook"
                      className="rounded max-w-xs border"
                    />
                  )
                )}
              </div>
              <div className="flex flex-col md:flex-row gap-2 items-start md:items-end">
                <Input
                  placeholder="Add text..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="flex-1"
                />
                <Input
                  placeholder="Paste image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddContent}
                  className="bg-neutral-800 text-white hover:bg-neutral-900"
                >
                  Add
                </Button>
              </div>
            </>
          ) : (
            <div className="text-neutral-700 text-center mt-20">
              Select a notebook to view or edit.
            </div>
          )}
        </main>
      </div>
    </>
  );
}