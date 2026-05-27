"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; color: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const colors = ["#7c3aed", "#8b5cf6", "#a78bfa", "#c4b5fd", "#ffffff"];
    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2.5 + 0.5, opacity: Math.random() * 0.7 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color; ctx.globalAlpha = p.opacity; ctx.fill();
        particles.slice(i + 1).forEach((p2) => {
          const dx = p.x - p2.x, dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = "#7c3aed"; ctx.globalAlpha = (1 - dist / 100) * 0.15;
            ctx.lineWidth = 0.5; ctx.stroke();
          }
        });
      });
      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animRef.current); };
  }, []);
  const handleGoogleLogin = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await signIn("credentials", {
      email, password, name,
      isSignUp: isSignUp.toString(),
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError(
        result.error === "Email already registered!" ? "Yeh email already registered hai!" :
        result.error === "Email not found!" ? "Email nahi mila!" :
        result.error === "Wrong password!" ? "Password galat hai!" : "Kuch gadbad ho gayi!"
      );
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-800/10 rounded-full blur-3xl z-0" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-violet-500 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-5 shadow-lg shadow-violet-500/30">📚</div>
          <h1 className="text-4xl font-extrabold tracking-tight">AI <span className="text-violet-400">Doubt</span> Solver</h1>
          <p className="text-zinc-400 mt-2 text-sm">India ka free AI tutor — koi bhi doubt, turant samadhan</p>
        </div>
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-700/50 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-center mb-1">{isSignUp ? "Account Banao! 🎓" : "Welcome Back! 👋"}</h2>
          <p className="text-zinc-400 text-sm text-center mb-6">{isSignUp ? "Naya account banao" : "Login karo aur padhna shuru karo"}</p>
          <button onClick={handleGoogleLogin} disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-2xl border border-zinc-600 bg-zinc-800/80 hover:bg-zinc-700 hover:border-violet-500/50 text-sm font-semibold transition-all disabled:opacity-50 mb-4">
            {loading ? <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" /> : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Google se Login karo
          </button>
<div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-zinc-700" />
            <span className="text-xs text-zinc-500">ya</span>
            <div className="flex-1 h-px bg-zinc-700" />
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {isSignUp && (
              <input value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Tumhara naam..." type="text"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition-all placeholder-zinc-500" />
            )}
            <input value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address..." type="email" required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition-all placeholder-zinc-500" />
            <input value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Password..." type="password" required
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm outline-none focus:border-violet-500 transition-all placeholder-zinc-500" />
            {error && (
              <p className="text-red-400 text-xs text-center bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">{error}</p>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-violet-500 hover:bg-violet-400 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : null}
              {isSignUp ? "Account Banao" : "Login Karo"}
            </button>
          </form>
          <p className="text-center text-xs text-zinc-500 mt-4">
            {isSignUp ? "Already account hai? " : "Naya user ho? "}
            <button onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
              className="text-violet-400 font-semibold hover:underline">
              {isSignUp ? "Login karo" : "Sign up karo"}
            </button>
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-5">
          {[{ icon: "🤖", text: "AI powered" }, { icon: "🌐", text: "Hindi support" }, { icon: "💯", text: "Bilkul free" }].map((f, i) => (
            <div key={i} className="bg-zinc-900/60 backdrop-blur-sm border border-zinc-700/50 rounded-2xl p-3 text-center">
              <div className="text-2xl mb-1">{f.icon}</div>
              <div className="text-xs text-zinc-400 font-medium">{f.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}          