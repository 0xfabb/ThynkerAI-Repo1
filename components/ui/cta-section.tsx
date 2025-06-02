import React from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { useRouter } from "next/navigation";

export const CTASection = () => {
    const router = useRouter();
    return (
        <section className="py-20 px-4 bg-gradient-to-br from-neutral-600 via-gray-600 to-zinc-600 relative overflow-hidden">
            {/* Animated background patterns */}
            <div className="absolute inset-0">
                <div
                    className="absolute top-0 left-0 w-full h-full animate-pulse opacity-20"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    }}
                ></div>
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
                    <CardContent className="p-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Ready to Transform Your Studies?
                        </h2>
                        <p className="text-xl text-white/90 mb-8 leading-relaxed">
                            Join thousands of students who are already studying smarter, not
                            harder. Start your AI-powered learning journey today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                            <Button
                                size="lg"
                                className="bg-white text-neutral-800 hover:bg-gray-100 text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                onClick={()=> {
                                    router.push("/auth")
                                }}
                            >
                                Get Started Free
                            </Button>
                          
                        </div>

                       
                    </CardContent>
                </Card>
                <footer className="mt-8 text-white/70 text-sm">
                    &copy; {new Date().getFullYear()}{" "}
                    <span className="font-semibold text-primary">CollegeAI</span>. All rights reserved.
                </footer>
            </div>
        </section>
    );
};
