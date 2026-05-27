export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/", "/chat", "/history", "/notes", "/leaderboard", "/profile"],
};

