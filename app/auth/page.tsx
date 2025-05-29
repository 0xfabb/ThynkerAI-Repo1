"use client";

import { useState, useEffect } from "react";
import { Account, ID } from "appwrite";
import { client } from "../../lib/appwrite";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Label } from "../../components/ui/label";
import { useRouter } from "next/navigation";

const account = new Account(client);

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    account.get()
      .then(() => {
        // If session exists, redirect to home
        navigate.push("/home");
      })
      .catch(() => {
        // Not logged in, stay on auth page
      });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      if (isLogin) {
        await account.createEmailPasswordSession(email, password);
        setSuccess("Logged in successfully!");
        navigate.push("/home");
      } else {
        const userId = ID.unique();
        await account.create(userId, email, password, name);
        setSuccess("Account created! You can now log in.");
        setIsLogin(true);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-300 dark:from-slate-900 dark:to-slate-800">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 dark:bg-slate-900/90">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? "Sign In" : "Create Account"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-1">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                  autoComplete="name"
                />
              </div>
            )}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@email.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                autoComplete={isLogin ? "current-password" : "new-password"}
              />
            </div>
            <Button
              type="submit"
              className="w-full mt-2"
              disabled={loading}
            >
              {loading
                ? (isLogin ? "Signing In..." : "Creating Account...")
                : (isLogin ? "Sign In" : "Sign Up")}
            </Button>
          </form>
          <Button
            variant="ghost"
            className="w-full mt-4 text-sm text-muted-foreground hover:text-primary"
            onClick={() => setIsLogin(!isLogin)}
            type="button"
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </Button>
          {error && (
            <div className="text-red-500 text-center mt-3">{error}</div>
          )}
          {success && (
            <div className="text-green-600 text-center mt-3">{success}</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthPage;