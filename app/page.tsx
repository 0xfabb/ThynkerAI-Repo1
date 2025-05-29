import React from "react";
import { Header } from "../src/components/Header";
import { Footer } from "../src/components/Footer";
import { StudyAssistant } from "../src/components/StudyAssistant";


const HomePage = () => {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 text-center drop-shadow">
            Welcome to the AI-Powered Study Assistant
          </h1> 

          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-center max-w-2xl">
            Your companion for smarter studying and efficient assignment
            management.
          </p>
          <StudyAssistant />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default HomePage;
