import React, { useState } from "react";
import { Button } from "./ui/button";
import { client } from "../lib/appwrite";
import { useRouter } from "next/navigation";
import { Account } from "appwrite";
import { LogOut } from "lucide-react";

const account = new Account(client);

export const LoggedNav = () => {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      router.push("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="flex items-center justify-between px-8 py-5 border-b bg-white/80 backdrop-blur sticky top-0 z-30 shadow-sm">
      <div className="text-2xl font-bold text-primary tracking-tight flex items-center gap-2">
        <span onClick={()=> {
          router.push("/home")
        }} role="img" aria-label="AI" className="cursor-pointer">Thynker</span>
      </div>
      {/* Hamburger Icon */}
      <button
        className="md:hidden flex flex-col justify-center items-center w-10 h-10"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
      >
        <span className={`block h-0.5 w-6 bg-black mb-1 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
        <span className={`block h-0.5 w-6 bg-black mb-1 transition-all ${menuOpen ? "opacity-0" : ""}`}></span>
        <span className={`block h-0.5 w-6 bg-black transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
      </button>
      {/* Desktop Nav */}
      <nav className="hidden md:flex items-center gap-8">
        <div className="flex gap-6">
          <a href="/home/ask" className="transition-colors px-2 py-1 rounded hover:bg-gray-900 hover:text-white duration-200">Ask a Doubt</a>
          <a href="/home/notebooks" className="transition-colors px-2 py-1 rounded hover:bg-gray-900 hover:text-white duration-200">Notebooks</a>
          <a href="/home/study" className="transition-colors px-2 py-1 rounded hover:bg-gray-900 hover:text-white duration-200">Euler AI</a>
          <a href="/home/maths" className="transition-colors px-2 py-1 rounded hover:bg-gray-900 hover:text-white duration-200">Thynker Agent</a>
        </div>
        <Button
          variant="ghost"
          className="bg-gray-900 text-white hover:text-white hover:bg-gray-800 transition-colors duration-200 cursor-pointer"
          onClick={handleLogout}
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
        </Button>
      </nav>
      {/* Mobile Nav */}
      {menuOpen && (
        <nav className="absolute top-20 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-6 md:hidden z-50 animate-fade-in">
          <a href="/home/ask" className="w-full text-center transition-colors px-4 py-2 rounded hover:bg-gray-900 hover:text-white duration-200" onClick={() => setMenuOpen(false)}>Ask a Doubt</a>
          <a href="/home/notebooks" className="w-full text-center transition-colors px-4 py-2 rounded hover:bg-gray-900 hover:text-white duration-200" onClick={() => setMenuOpen(false)}>Saved Notebooks</a>
          <a href="/home/study" className="w-full text-center transition-colors px-4 py-2 rounded hover:bg-gray-900 hover:text-white duration-200" onClick={() => setMenuOpen(false)}>Study with AI</a>
          <a href="/home/graphs" className="w-full text-center transition-colors px-4 py-2 rounded hover:bg-gray-900 hover:text-white duration-200" onClick={() => setMenuOpen(false)}>Graphs</a>
          <a href="/home/maths" className="w-full text-center transition-colors px-4 py-2 rounded hover:bg-gray-900 hover:text-white duration-200" onClick={() => setMenuOpen(false)}>Maths++ with AI</a>
          <Button
            variant="ghost"
            className="bg-gray-900 text-white hover:text-white hover:bg-gray-800 transition-colors duration-200 w-1/2"
            onClick={handleLogout}
            aria-label="Logout"
          >
           Logout
          </Button>
        </nav>
      )}
    </header>
  );
};
