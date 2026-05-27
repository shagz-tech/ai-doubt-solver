"use client";

import { useEffect, useState } from "react";
import { loadState, AppState } from "@/lib/store";

const mockUsers = [
  { name: "Priya Sharma", school: "DPS Delhi", pts: 2840, badge: "🏆 Champion" },
  { name: "Arjun Patel", school: "Kendriya Vidyalaya", pts: 2650, badge: "⭐ Expert" },
  { name: "Aisha Khan", school: "Ryan International", pts: 2430, badge: "🔥 Streak King" },
  { name: "Rahul Verma", school: "St. Xavier's", pts: 2210, badge: "📚 Scholar" },
  { name: "Sneha Iyer", school: "Sri Chaitanya", pts: 1890, badge: "💡 Rising Star" },
  { name: "Dev Singh", school: "FIITJEE", pts: 1650, badge: "📐 Math Wizard" },
];

const avatarColors = ["bg-violet-500", "bg-amber-500", "bg-green-500", "bg-rose-500", "bg-cyan-500", "bg-orange-500"];
const rankEmoji = ["🥇", "🥈", "🥉"];
const rankColors = ["text-amber-400", "text-zinc-400", "text-amber-700"];

export default function LeaderboardPage() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => { setState(loadState()); }, []);

  if (!state) return null;

  const allUsers = [
    ...mockUsers,
    { name: state.name, school: state.school || "Tumhara School", pts: state.points, badge: "👤 You", isMe: true },
  ].sort((a, b) => b.pts - a.pts);

  return (
    <main className="p-6 flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight">Leaderboard 🏆</h1>
        <p className="text-sm text-zinc-400 mt-1">Top students this week</p>
      </div>

      {/* Top 3 */}
      <div className="grid grid-cols-3 gap-4">
        {allUsers.slice(0, 3).map((u, i) => (
          <div key={i} className={`bg-zinc-900 border ${i === 0 ? "border-amber-500/30" : "border-zinc-800"} rounded-2xl p-4 text-center`}>
            <div className="text-2xl mb-2">{rankEmoji[i]}</div>
            <div className={`w-12 h-12 ${avatarColors[i]} rounded-2xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-2`}>
              {u.name[0]}
            </div>
            <p className="font-bold text-sm">{u.name}</p>
            <p className="text-xs text-zinc-500 mt-0.5">{u.school}</p>
            <p className={`font-extrabold text-lg mt-2 ${rankColors[i]}`}>{u.pts} pts</p>
            <span className="text-xs text-zinc-400">{u.badge}</span>
          </div>
        ))}
      </div>

      {/* Full list */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {allUsers.map((u, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 px-4 py-3 border-b border-zinc-800 last:border-0 transition-all ${
              (u as any).isMe ? "bg-violet-500/10 border-violet-500/20" : "hover:bg-zinc-800/50"
            }`}
          >
            <div className={`w-7 text-center font-extrabold text-sm ${rankColors[i] || "text-zinc-400"}`}>
              {i < 3 ? rankEmoji[i] : i + 1}
            </div>
            <div className={`w-9 h-9 ${avatarColors[i % avatarColors.length]} rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0`}>
              {u.name[0]}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">{u.name}{(u as any).isMe ? " (You)" : ""}</p>
              <p className="text-xs text-zinc-500">{u.school}</p>
            </div>
            <span className="text-xs text-zinc-400 hidden sm:block">{u.badge}</span>
            <span className="font-bold text-sm text-violet-400">{u.pts} pts</span>
          </div>
        ))}
      </div>
    </main>
  );
}
