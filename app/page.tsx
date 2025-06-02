"use client";

import React from "react";
import { Header } from "../components/Header";

import { Button } from "../components/ui/button";
import { useRouter } from "next/navigation";
import { CTASection } from "@/components/ui/cta-section";

const features = [
  {
    title: "📚 Personalized Learning",
    description:
      "Get custom explanations and notes tailored to your learning pace and style.",
  },
  {
    title: "🧮 Ace Math with AI",
    description:
      "Step-by-step solutions, visual graphs, and even video walkthroughs for every math topic.",
  },
  {
    title: "📝 Smart Notes & Summaries",
    description:
      "Convert lectures, PDFs, or questions into neatly formatted study notes in seconds.",
  },
  {
    title: "🎥 AI Video Companion",
    description:
      "Ask questions and get visual + video answers powered by advanced AI models.",
  },
  {
    title: "📈 Graphs, Charts, and Diagrams",
    description:
      "Automatically generate visuals for complex problems and concepts to make learning easier.",
  },
  {
    title: "🚀 Boost Productivity",
    description:
      "Manage assignments, schedule tasks, and study better with our built-in assistant tools.",
  },
];

const HomePage = () => {
  const router = useRouter();
  return (
    <>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header />

        <main className="flex-1 px-4 py-10 flex flex-col items-center">
          <section className="text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-4 drop-shadow">
              Your AI-Powered Study Partner
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6">
              Built for college students. Learn, solve, and stay ahead — with
              personalized AI support in every subject, especially math.
            </p>
            <Button
              onClick={() => router.push("/auth")}
              size="lg"
              className="text-lg px-6 py-4"
            >
              Try it Free
            </Button>
          </section>

          <section className="mt-16 w-full max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              What Can It Do?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-2xl shadow-md p-6 border border-slate-200 dark:border-slate-700"
                >
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-20 text-center max-w-2xl">
            <h2 className="text-2xl font-bold mb-4">
              Why College Students Love It
            </h2>
            <p className="text-muted-foreground mb-6">
              Whether you&apos;re pulling an all-nighter or prepping early for
              finals, this AI study partner helps you stay on track, boost your
              grades, and make learning less stressful.
            </p>
            <Button variant="outline" size="lg">
              Watch Demo Video
            </Button>
          </section>
        </main>
        <CTASection />
      </div>
    </>
  );
};

export default HomePage;
