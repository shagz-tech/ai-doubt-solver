"use client";

import { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Send, Trash2, FileText } from "lucide-react";
import {
  loadState,
  saveState,
  AppState,
  SUBJECTS,
  LANGUAGES,
} from "@/lib/store";

interface Message {
  role: "user" | "ai";
  content: string;
}

const quickQuestions = [
  "x² + 5x + 6 = 0 solve karo",
  "Ohm ka law kya hai?",
  "DNA aur RNA mein fark kya hai?",
  "Mughal Empire kab shuru hua?",
  "Python mein list aur tuple ka fark?",
];

function formatMessage(text: string): string {
  return text
    .replace(/```([\s\S]*?)```/g, "<pre class='bg-zinc-800 border border-zinc-700 rounded-lg p-3 my-2 text-xs font-mono overflow-x-auto whitespace-pre-wrap'>$1</pre>")
    .replace(/\*\*(.*?)\*\*/g, "<strong class='text-violet-300'>$1</strong>")
    .replace(/`([^`]+)`/g, "<code class='bg-zinc-700 px-1.5 py-0.5 rounded text-amber-300 text-xs font-mono'>$1</code>")
    .replace(/\n/g, "<br/>");
}

function ChatContent() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      content:
        "👋 **Namaste!** Main AI Doubt Solver hoon — tumhara study buddy.\n\nKoi bhi subject ka sawaal poochho — step-by-step samjhaunga, bilkul free! 🎓\n\n💡 *Tip: Upar subject aur bhasha select karo!*",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState("Math");
  const [lang, setLang] = useState("Hinglish");
  const [state, setState] = useState<AppState | null>(null);
  const [todayCount, setTodayCount] = useState(0);
  const [dailyGoal, setDailyGoal] = useState(5);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatHistory = useRef<{ role: string; content: string }[]>([]);

  useEffect(() => {
    const s = loadState();
    setState(s);
    setLang(s.defaultLang || "Hinglish");
    setTodayCount(s.todayCount || 0);
    setDailyGoal(s.dailyGoal || 5);

    const q = searchParams.get("q");
    if (q) {
      setInput(q);
      setTimeout(() => handleSend(q, s), 300);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string, initialState?: AppState) => {
    const msg = text || input.trim();
    if (!msg || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    chatHistory.current.push({ role: "user", content: msg });

    const systemPrompt = `You are AI Doubt Solver, a friendly AI tutor for Indian students (classes 6-12 and college).
Subject: ${subject}. Respond in: ${lang}.
Rules: Always respond in ${lang}. Give clear step-by-step explanations. Use simple language. Show working for math/science. Use examples relatable to Indian students. Be encouraging. Use **bold** for key terms.`;

    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: chatHistory.current.map((m) => ({
              role: m.role === "assistant" ? "model" : "user",
              parts: [{ text: m.content }],
            })),
          }),
        }
      );

      const data = await res.json();
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Kuch gadbad ho gayi! Dobara try karo.";

      chatHistory.current.push({ role: "assistant", content: reply });
      setMessages((prev) => [...prev, { role: "ai", content: reply }]);

      // Save to state
      const currentState = initialState || state;
      if (currentState) {
        const newState: AppState = {
          ...currentState,
          doubts: [
            {
              id: Date.now(),
              q: msg,
              a: reply,
              subject,
              time: new Date().toLocaleString("en-IN"),
            },
            ...currentState.doubts,
          ].slice(0, 100),
          points: currentState.points + 10,
          todayCount: (currentState.todayCount || 0) + 1,
          lastActive: new Date().toDateString(),
        };
        saveState(newState);
        setState(newState);
        setTodayCount(newState.todayCount);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content:
            "⚠️ **API Key nahi mili!**\n\nPehle `next.config.ts` mein Gemini API key daalo.",
        },
      ]);
    }

    setLoading(false);
  };

  const clearChat = () => {
    if (!confirm("Chat clear karein?")) return;
    chatHistory.current = [];
    setMessages([
      {
        role: "ai",
        content: "Chat clear ho gayi! Naya sawaal poochho 😊",
      },
    ]);
  };

  const saveAsNote = () => {
    if (chatHistory.current.length < 2) {
      alert("Pehle koi doubt poochho!");
      return;
    }
    const last = chatHistory.current[chatHistory.current.length - 2];
    if (state) {
      const newState: AppState = {
        ...state,
        notes: [
          {
            id: Date.now(),
            title: last.content.slice(0, 50),
            content: chatHistory.current
              .slice(-2)
              .map((m) => (m.role === "user" ? "Q: " : "A: ") + m.content)
              .join("\n\n"),
            subject,
            time: new Date().toLocaleDateString("en-IN"),
          },
          ...state.notes,
        ],
      };
      saveState(newState);
      setState(newState);
      alert("Note save ho gaya! 📝");
    }
  };

  const progress = Math.min(100, (todayCount / dailyGoal) * 100);

  return (
    <main className="flex gap-4 p-4 h-[calc(100vh-0px)]">
      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
        {/* Chat header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800">
          <span className="text-xs font-semibold text-zinc-400">Subject:</span>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-2 py-1.5 outline-none cursor-pointer"
          >
            {SUBJECTS.map((s) => <option key={s}>{s}</option>)}
          </select>
          <span className="text-xs font-semibold text-zinc-400">Bhasha:</span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs rounded-lg px-2 py-1.5 outline-none cursor-pointer"
          >
            {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
          </select>
          <div className="ml-auto flex gap-2">
            <button
              onClick={saveAsNote}
              className="w-8 h-8 rounded-lg border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 transition-all"
              title="Save as note"
            >
              <FileText size={14} />
            </button>
            <button
              onClick={clearChat}
              className="w-8 h-8 rounded-lg border border-zinc-700 bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-zinc-700 transition-all"
              title="Clear chat"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-3 msg-animate ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                  msg.role === "ai"
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                    : "bg-green-500/20 text-green-300 border border-green-500/30"
                }`}
              >
                {msg.role === "ai" ? "AI" : state?.name?.[0]?.toUpperCase() || "S"}
              </div>
              <div
                className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "ai"
                    ? "bg-zinc-800 border border-zinc-700 rounded-tl-sm"
                    : "bg-violet-500/20 border border-violet-500/25 rounded-tr-sm"
                }`}
                dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
              />
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 msg-animate">
              <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center justify-center text-xs font-bold">
                AI
              </div>
              <div className="bg-zinc-800 border border-zinc-700 rounded-2xl rounded-tl-sm px-4 py-3">
                <div className="flex gap-1.5 items-center h-4">
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full typing-dot" />
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full typing-dot" />
                  <span className="w-1.5 h-1.5 bg-violet-400 rounded-full typing-dot" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-3 border-t border-zinc-800">
          <div className="flex gap-2 items-end bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2 focus-within:border-violet-500/50 transition-all">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Apna sawaal yahan likho... (Enter to send)"
              rows={1}
              className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-100 placeholder-zinc-500 resize-none min-h-[22px] max-h-[120px]"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="w-8 h-8 bg-violet-500 hover:bg-violet-400 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg flex items-center justify-center text-white transition-all shrink-0"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-64 flex flex-col gap-3 shrink-0">
        {/* Quick questions */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <h4 className="text-xs font-bold text-zinc-400 mb-3">⚡ Quick Questions</h4>
          <div className="flex flex-col gap-1.5">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setInput(q)}
                className="text-left px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800 text-xs text-zinc-400 hover:border-violet-500/40 hover:text-violet-300 hover:bg-violet-500/10 transition-all leading-snug"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Today stats */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <h4 className="text-xs font-bold text-zinc-400 mb-3">📊 Today&apos;s Stats</h4>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Doubts today</span>
              <strong>{todayCount}</strong>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-400">Points earned</span>
              <strong className="text-violet-400">{todayCount * 10}</strong>
            </div>
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-violet-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-zinc-500">
              Goal: {todayCount}/{dailyGoal} doubts
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="p-6 text-zinc-400">Loading...</div>}>
      <ChatContent />
    </Suspense>
  );
}
