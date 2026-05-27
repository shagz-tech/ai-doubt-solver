"use client";

import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import AuthProvider from "@/components/AuthProvider";
import { usePathname } from "next/navigation";

const geist = Geist({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.className} bg-zinc-950 text-zinc-100 min-h-screen`}>
        <AuthProvider>
          {isLoginPage ? (
            <>{children}</>
          ) : (
            <div className="flex min-h-screen">
              <Sidebar />
              <div className="flex-1 flex flex-col min-w-0">
                {children}
              </div>
            </div>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}