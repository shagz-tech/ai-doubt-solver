"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  MessageCircle,
  BookOpen,
  FileText,
  Trophy,
  User,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/", icon: Home, section: "main" },
  { label: "Ask Doubt", href: "/chat", icon: MessageCircle, section: "main" },
  { label: "Doubt History", href: "/history", icon: BookOpen, section: "study" },
  { label: "My Notes", href: "/notes", icon: FileText, section: "study" },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy, section: "community" },
  { label: "Profile", href: "/profile", icon: User, section: "bottom" },
];

export default function Sidebar() {
  const pathname = usePathname();

  const renderSection = (section: string, label: string) => {
    const items = navItems.filter((i) => i.section === section);
    return (
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 px-3 py-2">
          {label}
        </p>
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${
                active
                  ? "bg-violet-500/15 text-violet-300"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
              }`}
            >
              <Icon size={18} />
              {item.label}
              {item.label === "Ask Doubt" && (
                <span className="ml-auto bg-violet-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  AI
                </span>
              )}
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <aside className="w-[240px] h-screen sticky top-0 bg-zinc-900 border-r border-zinc-800 flex flex-col p-3 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-3 mb-2 border-b border-zinc-800">
        <div className="w-8 h-8 bg-violet-500 rounded-lg flex items-center justify-center text-base">
          📚
        </div>
        <span className="font-bold text-base tracking-tight">
          AI <span className="text-violet-400">Doubt</span> Solver
        </span>
      </div>

      {/* Nav */}
      <div className="flex flex-col flex-1 gap-1">
        {renderSection("main", "Main")}
        {renderSection("study", "Study")}
        {renderSection("community", "Community")}
      </div>

      {/* Bottom */}
      <div className="border-t border-zinc-800 pt-2">
        {navItems
          .filter((i) => i.section === "bottom")
          .map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-violet-500/15 text-violet-300"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
      </div>
    </aside>
  );
}