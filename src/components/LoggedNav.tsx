import React from "react";
import { Button } from "../../components/ui/button";
import { client } from "../../lib/appwrite";
import { useRouter } from "next/navigation";
import { Account } from "appwrite";

const account = new Account(client);

export const LoggedNav = () => {
  const router = useRouter();
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
        <span role="img" aria-label="AI"></span> StudyAI
      </div>
      <nav>
        <Button variant="ghost">
          <span className="flex items-center justify-center w-8 h-8 bg-black rounded-full">
            {/* <BsPerson className="text-white w-5 h-5" /> */}
            <Button onClick={handleLogout}>Logout</Button>
          </span>
        </Button>
      </nav>
    </header>
  );
};
