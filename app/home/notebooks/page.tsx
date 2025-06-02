"use client";

import { useEffect, useState } from "react";
import { LoggedNav } from "@/components/LoggedNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus, FaShareAlt, FaLock, FaUnlock, FaBookOpen, FaImage } from "react-icons/fa";
import axios from "axios";
import { account } from "../../../lib/appwrite";
import Image from "next/image";

type Notebook = {
  $id: string;
  bookname: string;
  Content: (string | { type: "image"; url: string })[];
  visibility: "private" | "public";
  email: string;
};

export default function NotebooksPage() {
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [userEmail, setUserEmail] = useState<string>("");

  const selectedNotebook = notebooks.find((nb) => nb.$id === selectedId);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const userData = await account.get();
        setUserEmail(userData.email);
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
      await axios.patch("/api/notebooks", {
        $id: selectedNotebook.$id,
        Content: JSON.stringify(updatedContent),
      });
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
    // Optionally, PATCH the notebook on the server here
  };

  return (
    <>
      <LoggedNav />
      <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-purple-900">
        {/* Sidebar */}
        <aside className="w-full md:w-72 bg-white/80 dark:bg-slate-900/80 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 p-3 md:p-4 flex flex-col rounded-none md:rounded-br-3xl shadow-xl min-h-[120px] max-h-60 md:max-h-none overflow-x-auto md:overflow-y-auto">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Input
              placeholder="New notebook title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="flex-1 text-sm"
            />
            <Button
              onClick={handleAddNotebook}
              className="bg-gradient-to-r from-zinc-700 to-neutral-700 text-white hover:from-neutral-800 hover:to-stone-800 shadow"
              size="icon"
              aria-label="Add Notebook"
            >
              <FaPlus />
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {notebooks.length === 0 && (
              <div className="text-center text-muted-foreground mt-6 md:mt-10 text-sm">
                <FaBookOpen className="mx-auto mb-2 text-2xl md:text-3xl opacity-60" />
                No notebooks yet.
              </div>
            )}
            {notebooks.map((nb) => (
              <div
                key={nb.$id}
                className={`flex items-center justify-between p-2 md:p-3 rounded-xl cursor-pointer mb-2 transition-colors ${
                  selectedId === nb.$id
                    ? "bg-gradient-to-r from-neutral-600 to-zinc-600 text-white shadow"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                onClick={() => setSelectedId(nb.$id)}
              >
                <span className="flex items-center gap-2 font-medium text-base md:text-lg">
                  <FaBookOpen className="text-base md:text-lg" />
                  {nb.bookname}
                </span>
                <span
                  className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                    nb.visibility === "private"
                      ? "bg-gray-200 text-gray-700"
                      : "bg-gray-200 text-slate-800"
                  }`}
                >
                  {nb.visibility}
                </span>
              </div>
            ))}
          </div>
        </aside>
        {/* Main Notebook Area */}
        <main className="flex-1 flex flex-col bg-white/90 dark:bg-slate-900/90 p-2 md:p-8 rounded-tl-2xl md:rounded-tl-3xl shadow-lg min-h-[200px] md:min-h-[400px] overflow-x-auto">
          {selectedNotebook ? (
            <>
              {/* Sticky Header */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 sticky top-0 bg-white/90 dark:bg-slate-900/90 z-10 py-2 px-2 rounded-tl-2xl shadow">
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  <FaBookOpen className="text-slate-700 dark:text-blue-300" />
                  {selectedNotebook.bookname}
                </h2>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <Button
                    variant="outline"
                    className="flex items-center gap-1 text-xs md:text-base"
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
                  <Button variant="outline" className="flex items-center gap-1 text-xs md:text-base">
                    <FaShareAlt /> Share
                  </Button>
                </div>
              </div>
              {/* Notebook Content */}
              <div className="flex flex-col gap-3 md:gap-4 mb-4 md:mb-6">
                {(selectedNotebook?.Content?.length ?? 0) === 0 && (
                  <div className="text-neutral-700 text-center py-6 md:py-8 text-sm md:text-base">
                    No content yet. Start adding notes or images!
                  </div>
                )}
                {(Array.isArray(selectedNotebook?.Content) ? selectedNotebook.Content : []).map((item, idx) =>
                  typeof item === "string" ? (
                    <div
                      key={idx}
                      className="bg-gradient-to-r from-slate-100 to-stone-100 dark:from-slate-800 dark:to-purple-900 rounded-xl p-3 md:p-4 text-sm md:text-base shadow"
                    >
                      {item}
                    </div>
                  ) : (
                    <div key={idx} className="flex items-center gap-2">
                      <FaImage className="text-blue-400" />
                      <Image
                        src={item.url}
                        alt="Notebook"
                        width={120}
                        height={80}
                        className="rounded-lg border shadow"
                        style={{ maxHeight: 80, objectFit: "cover" }}
                      />
                    </div>
                  )
                )}
              </div>
              {/* Add Content */}
              <div className="flex flex-col md:flex-row gap-2 items-start md:items-end bg-slate-50 dark:bg-slate-800 p-3 md:p-4 rounded-xl shadow-inner">
                <Input
                  placeholder="Add text..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="flex-1 text-sm"
                />
                <Input
                  placeholder="Paste image URL..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-1 text-sm"
                />
                <Button
                  onClick={handleAddContent}
                  className="bg-gradient-to-r from-neutral-700 to-zinc-700 text-white hover:from-neutral-800 hover:to-zinc-800 shadow text-sm md:text-base"
                >
                  <FaPlus className="mr-2" /> Add
                </Button>
              </div>
            </>
          ) : (
            <div className="text-neutral-700 text-center mt-10 md:mt-20 text-sm md:text-base">
              Select a notebook to view or edit.
            </div>
          )}
        </main>
      </div>
    </>
  );
}