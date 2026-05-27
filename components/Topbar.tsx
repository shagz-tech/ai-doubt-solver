"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { loadState, saveState, AppState } from "@/lib/store";
import Link from "next/link";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/chat": "Ask Doubt",
  "/history": "Doubt History",
  "/notes": "My Notes",
  "/leaderboard": "Leaderboard",
  "/profile": "Profile & Settings",
};

export default function Topbar({ pathname }: { pathname: string }) {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    const s = loadState();
    setState(s);
  }, []);

  const toggleTheme = () => {
    if (!state) return;
    const newState = {
      ...state,
      theme: state.theme === "dark" ? "light" : "dark",
    } as AppState;
    saveState(newState);
    setState(newState);
    document.documentElement.classList.toggle("dark");
  };

  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="h-14 sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800 flex items-center px-6 gap-4">
      <span className="font-bold text-base tracking-tight">{title}</span>

      <div className="ml-auto flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 rounded-lg border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-all"
        >
          {state?.theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* User chip */}
        <Link
          href="/profile"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-700 bg-zinc-800 hover:bg-zinc-700 transition-all cursor-pointer"
        >
          <div className="w-6 h-6 rounded-full bg-violet-500 flex items-center justify-center text-white text-xs font-bold">
            {state?.name?.[0]?.toUpperCase() || "S"}
          </div>
          <span className="text-sm font-semibold text-zinc-200">
            {state?.name?.split(" ")[0] || "Student"}
          </span>
        </Link>
      </div>
    </header>
  );
}