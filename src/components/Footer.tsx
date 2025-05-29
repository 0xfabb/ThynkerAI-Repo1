import React from "react";

export const Footer = () => (
  <footer className="w-full py-4 border-t text-center text-muted-foreground bg-white/80 backdrop-blur shadow-inner">
    &copy; {new Date().getFullYear()}{" "}
    <span className="font-semibold text-primary">StudyAI</span>. All rights
    reserved.
  </footer>
);