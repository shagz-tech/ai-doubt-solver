"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, FileText, Flame, Star } from "lucide-react";
import {
  loadState,
  checkStreak,
  saveState,
  AppState,
  subjectIcons,
  subjectColors,
} from "@/lib/store";

const quickQuestions = [
  { icon: "📐", text: "Pythagoras theorem explain karo" },
  { icon: "⚡", text: "Newton ke 3 laws kya hain?" },
  { icon: "🌱", text: "Photosynthesis kaise hoti hai?" },
  { icon: "🔢", text: "Quadratic formula solve karo" },
  { icon: "📜", text: "French Revolution kab hua aur kyu?" },
  { icon: "💻", text: "Recursion kya hai programming mein?" },
];

export default function HomePage() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    let s = loadState();
    s = checkStreak(s);
    saveState(s);
    setState(s);
  }, []);

  if (!state) return null;

  const subjectCounts: Record<string, number> = {};
  state.doubts.forEach((d) => {
    subjectCounts[d.subject] = (subjectCounts[d.subject] || 0) + 1;
  });
  const maxCount = Math.max(...Object.values(subjectCounts), 1);

  return (
    <main className="p-6 flex flex-col gap-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Namaste, <span className="text-violet-400">{state.name}</span>! 👋
        </h1>
        <p className="text-sm text-zinc-400 mt-1">Aaj kya padhna hai?</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          {
            icon: <MessageCircle size={18} />,
            color: "bg-blue-500/10 text-blue-400",
            val: state.doubts.length,
            label: "Doubts Solved",
            badge: `+${state.todayCount} today`,
            badgeColor: "bg-green-500/10 text-green-400",
          },
          {
            icon: <FileText size={18} />,
            color: "bg-green-500/10 text-green-400",
            val: state.notes.length,
            label: "Notes Saved",
            badge: "Active",
            badgeColor: "bg-green-500/10 text-green-400",
          },
          {
            icon: <Flame size={18} />,
            color: "bg-amber-500/10 text-amber-400",
            val: state.streak,
            label: "Day Streak",
            badge: "🔥 Keep going",
            badgeColor: "bg-amber-500/10 text-amber-400",
          },
          {
            icon: <Star size={18} />,
            color: "bg-violet-500/10 text-violet-400",
            val: state.points,
            label: "Points Earned",
            badge: "⭐ Rank",
            badgeColor: "bg-violet-500/10 text-violet-400",
          },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                {s.icon}
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.badgeColor}`}>
                {s.badge}
              </span>
            </div>
            <div>
              <div className="text-3xl font-extrabold tracking-tight">{s.val}</div>
              <div className="text-xs text-zinc-400 mt-0.5">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent doubts + Subject progress */}
      <div className="grid grid-cols-2 gap-4">
        {/* Recent doubts */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-sm">Recent Doubts</span>
            <Link href="/history" className="text-xs text-violet-400 font-medium hover:underline">
              View all →
            </Link>
          </div>
          {state.doubts.length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              <div className="text-3xl mb-2">💭</div>
              <p className="text-sm">Koi doubt nahi abhi tak.<br />Pehla sawaal poochho!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {state.doubts.slice(0, 4).map((d) => (
                <div key={d.id} className="flex items-center gap-3 py-tthdthfhtff border-b border-zinc-800 last:border-0">
                  <span className="text-lg">{subjectIcons[d.subject] || "📚"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{d.q}</p>
                    <p className="text-xs text-zinc-500">{d.time}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subject progress */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="font-bold text-sm mb-3">Subject Progress</div>
          {Object.keys(subjectCounts).length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              <div className="text-3xl mb-2">📊</div>
              <p className="text-sm">Koi data nahi abhi.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {Object.entries(subjectCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([subject, count]) => (
                  <div key={subject}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{subjectIcons[subject]} {subject}</span>
                      <span className="text-zinc-400">{count} doubts</span>
                    </div>
                    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-500 rounded-full transition-all duration-500"
                        style={{ width: `${(count / maxCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Ask */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
        <div className="font-bold text-sm mb-3">Quick Ask ⚡</div>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, i) => (
            <Link
              key={i}
              href={`/chat?q=${encodeURIComponent(q.text)}`}
              className="px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-xs text-zinc-300 hover:border-violet-500/50 hover:text-violet-300 hover:bg-violet-500/10 transition-all"
            >
              {q.icon} {q.text}
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
