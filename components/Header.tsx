import React from "react";
import { Button } from "./ui/button";

export const Header = () => (
  <header className="scroll-hidden flex items-center justify-between px-8 py-5 border-b bg-white/80 backdrop-blur sticky top-0 z-30 shadow-sm">
    <div className="text-2xl font-bold text-primary tracking-tight flex items-center gap-2">
    ThynkerAI
    </div>
    <nav>
      <Button
        className="
      bg-neutral-800
      text-white
      hover:bg-neutral-900
      hover:text-white
      "
        variant="ghost"
      >
        Sign Up
      </Button>
    </nav>
  </header>
);
