import React from "react";
import { Button } from "../ui/button";
import { ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";
export const HeroSection = () => {
  const router = useRouter();
  return (
    <section className="w-full min-h-screen flex flex-col justify-center items-center bg-transparent">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-neutral-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-zinc-900 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-gray-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-zinc-600 via-neutral-600 to-stone-800 bg-clip-text text-transparent mb-6 leading-tight">
            Your AI-Powered
            <br />
            Study Partner
          </h1>
        </div>
        
        <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Built for college students. Learn, solve, and stay ahead with personalized AI support in every subject, 
            <span className="font-semibold text-primary"> especially math.</span>
          </p>
        </div>

        <div className="animate-fade-in space-y-6" style={{ animationDelay: '0.6s' }}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button onClick={()=>{
              router.push("/auth")
            }} size="lg" className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Try it Free
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-4 hover:scale-105 transition-transform duration-300">
              Watch Demo
            </Button>
          </div>
          
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="inline-flex items-center px-4 py-2 bg-blue-100 text-zinc-700 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors">
              ✨ No credit card required
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors">
              ⚡ Instant signup
            </span>
            <span className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium hover:bg-green-200 transition-colors">
              🎓 Made for students
            </span>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-muted-foreground" />
        </div>
      </div>
    </section>
  );
};
