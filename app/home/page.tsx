"use client";

import { useEffect, useState } from "react";
import { client } from "../../lib/appwrite";
import { Account } from "appwrite";
import { useRouter } from "next/navigation";
import { LoggedNav } from "@/components/LoggedNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaBook, FaRobot, FaChartBar, FaPenFancy, FaArrowRight } from "react-icons/fa";

const account = new Account(client);

const quickLinks = [
	{
		label: "Ask a Doubt",
		href: "/home/ask",
		icon: <FaRobot className="text-blue-500" />,
		desc: "Get instant help from AI for your questions.",
	},
	{
		label: "Saved Notebooks",
		href: "/home/notebooks",
		icon: <FaBook className="text-green-500" />,
		desc: "Review and organize your saved notes.",
	},
	{
		label: "Study with AI",
		href: "/home/study",
		icon: <FaPenFancy className="text-purple-500" />,
		desc: "Continue your AI-powered study sessions.",
	},
	{
		label: "Graphs",
		href: "/home/graphs",
		icon: <FaChartBar className="text-yellow-500" />,
		desc: "Visualize and analyze your progress.",
	},
];

const Home = () => {
	const router = useRouter();
	const [user, setUser] = useState<{ name?: string } | null>(null);
	const [loading, setLoading] = useState(true);
	const [search, setSearch] = useState("");

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

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (search.trim()) {
			// You can route to a search/ai page or handle as needed
			router.push(`/home/ask?query=${encodeURIComponent(search)}`);
		}
	};

	return (
		<>
			<LoggedNav />
			<div className="max-w-3xl mx-auto mt-6 p-4 flex flex-col gap-6">
				<div className="mb-2 text-2xl font-bold text-neutral-800 text-center">
					Hello{user?.name ? `, ${user.name}` : ""}!
				</div>
				<h2 className="text-xl font-semibold text-center text-neutral-700 mb-2">
					Continue where you left off or start something new
				</h2>
				<form
					onSubmit={handleSearch}
					className="flex gap-2 items-center justify-center"
				>
					<Input
						className="w-full max-w-md border-neutral-300 focus:outline-neutral-400"
						placeholder="Ask AI to help you with anything..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<Button
						type="submit"
						className="bg-neutral-900 text-white hover:bg-neutral-900 px-4 py-2"
					>
						<FaArrowRight />
					</Button>
				</form>
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
					{quickLinks.map((link) => (
						<div
							key={link.href}
							className="relative group cursor-pointer rounded-2xl p-5 bg-gradient-to-br from-neutral-50 to-neutral-50 border border-neutral-100 shadow-md hover:shadow-xl transition-all duration-200 hover:scale-[1.025] flex flex-col gap-2"
							onClick={() => router.push(link.href)}
						>
							<div className="flex items-center gap-3 mb-1">
								<span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 group-hover:bg-neutral-200 transition">
									{link.icon}
								</span>
								<span className="text-lg font-bold text-neutral-900">
									{link.label}
								</span>
								<span className="ml-auto text-xs px-2 py-1 rounded-full bg-neutral-200 text-neutral-800 font-semibold uppercase tracking-wide shadow-sm">
									{link.label.split(" ")[0]}
								</span>
							</div>
							<div className="text-sm text-neutral-900 opacity-80">
								{link.desc}
							</div>
							<span className="absolute right-5 bottom-5 opacity-0 group-hover:opacity-100 transition text-neutral-400">
								<FaArrowRight />
							</span>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default Home;
