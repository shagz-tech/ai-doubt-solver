"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { loadState, saveState, AppState, subjectIcons, subjectColors } from "@/lib/store";

export default function HistoryPage() {
  const [state, setState] = useState<AppState | null>(null);

  useEffect(() => {
    setState(loadState());
  }, []);

  const clearHistory = () => {
    if (!confirm("Saari history delete karein?")) return;
    const newState = { ...state!, doubts: [] };
    saveState(newState);
    setState(newState);
  };

  if (!state) return null;

  return (
    <main className="p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight">Doubt History 📖</h1>
          <p className="text-sm text-zinc-400 mt-1">Tumhare saare purane doubts</p>
        </div>
        {state.doubts.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-sm text-zinc-400 hover:text-red-400 hover:border-red-500/30 transition-all"
          >
            <Trash2 size={14} /> Clear All
          </button>
        )}
      </div>

      {state.doubts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-zinc-500">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-base font-medium">Abhi tak koi doubt nahi.</p>
          <p className="text-sm mt-1">Chat mein jao aur pehla sawaal poochho!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {state.doubts.map((d) => (
            <div
              key={d.id}
              className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-4 flex items-start gap-4 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 ${subjectColors[d.subject] || "bg-zinc-800"}`}>
                {subjectIcons[d.subject] || "📚"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{d.q}</p>
                <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{d.a.slice(0, 120)}...</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${subjectColors[d.subject] || "bg-zinc-700 text-zinc-300"}`}>
                    {d.subject}
                  </span>
                  <span className="text-xs text-zinc-500">{d.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}