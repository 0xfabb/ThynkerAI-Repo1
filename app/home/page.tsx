"use client"

import { useEffect, useState } from "react";
import { client } from "../../lib/appwrite";
import { Account } from "appwrite";
import { useRouter } from "next/navigation";
import { StudyAssistant } from "@/src/components/StudyAssistant";
import { LoggedNav } from "@/src/components/LoggedNav";

const account = new Account(client);

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userData = await account.get();
        setUser(userData);
      } catch {
        router.replace("/auth");
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <LoggedNav />
      <div className="flex flex-col mt-3 p-4 text-center">
        <div className="mb-2 text-lg font-semibold">
          Hello{user?.name ? `, ${user.name}` : ""}!
        </div>
        <StudyAssistant />
      </div>
    </>
  );
};

export default Home;
