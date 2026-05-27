# 🎓 AI Doubt Solver

<div align="center">

![AI Doubt Solver](https://img.shields.io/badge/AI%20Doubt%20Solver-v1.0.0-violet?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ecf8e?style=for-the-badge&logo=supabase)

**India ka free AI tutor — koi bhi doubt, turant samadhan** 🚀

[Live Demo](#) • [Report Bug](../../issues) • [Request Feature](../../issues)

</div>

---

## ✨ Features

- 🤖 **AI-Powered Doubt Solving** — Powered by Google Gemini 2.0 Flash
- 🌐 **Multi-Language Support** — Hindi, English, Hinglish, Bengali, Tamil, Telugu
- 📚 **7 Subjects** — Math, Physics, Chemistry, Biology, History, English, Computer Science
- 🔐 **Authentication** — Google OAuth + Email/Password login
- 📖 **Doubt History** — Saare purane doubts save hote hain
- 📝 **Notes System** — Important points note karo
- 🏆 **Leaderboard** — Top students ki ranking
- 🌙 **Dark/Light Mode** — Theme toggle
- 📊 **Dashboard** — Daily progress aur stats
- 🔥 **Streak System** — Daily study streak track karo

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React Framework |
| **TypeScript** | Type Safety |
| **Tailwind CSS** | Styling |
| **NextAuth.js** | Authentication |
| **Supabase** | Database |
| **Google Gemini API** | AI Responses |
| **Lucide React** | Icons |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Cloud Console account
- Supabase account
- Google AI Studio account

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/shagz-tech/ai-doubt-solver.git
cd ai-doubt-solver
```

**2. Install dependencies**
```bash
npm install
```

**3. Environment variables setup**

`.env.local` file banao root folder mein:
```env
GEMINI_API_KEY=your_gemini_api_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**4. Supabase mein users table banao**
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**5. Run the development server**
```bash
npm run dev
```

**6. Open** [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
ai-doubt-solver/
├── app/
│   ├── api/auth/[...nextauth]/
│   │   └── route.ts          # NextAuth API route
│   ├── chat/
│   │   └── page.tsx          # AI Chat page
│   ├── history/
│   │   └── page.tsx          # Doubt history
│   ├── leaderboard/
│   │   └── page.tsx          # Leaderboard
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── notes/
│   │   └── page.tsx          # Notes page
│   ├── profile/
│   │   └── page.tsx          # Profile & settings
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Dashboard
├── components/
│   ├── AuthProvider.tsx      # Session provider
│   ├── Sidebar.tsx           # Navigation sidebar
│   └── Topbar.tsx            # Top navigation bar
├── lib/
│   ├── store.ts              # State management
│   └── supabase.ts           # Supabase client
└── middleware.ts             # Route protection
```

---

## 🤝 Contributing

Contributions are welcome! 🎉

1. **Fork** this repo
2. Create a branch: `git checkout -b feature/amazing-feature`
3. Commit: `git commit -m "feat: add amazing feature"`
4. Push: `git push origin feature/amazing-feature`
5. Open a **Pull Request**

### Good First Issues 🟢
- [ ] Add image upload for question photos
- [ ] Add more Indian languages (Marathi, Gujarati)
- [ ] Add math equation renderer (KaTeX)
- [ ] Add sound notifications
- [ ] Improve mobile responsiveness
- [ ] Add quiz/practice mode



## 📜 License

MIT License — free to use, modify, and distribute.

---

## 👩‍💻 Author

**Shagun** — Built with ❤️ 

[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat&logo=github)](https://github.com/shagz-tech)

---

<div align="center">
Made with ❤️ for India's 250M+ students 🇮🇳
</div>