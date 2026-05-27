import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        isSignUp: { label: "isSignUp", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("email", credentials.email)
          .single();

        if (credentials.isSignUp === "true") {
          if (existingUser) throw new Error("Email already registered!");
          const hashedPassword = await bcrypt.hash(credentials.password, 10);
          const { data: newUser, error } = await supabase
            .from("users")
            .insert({
              email: credentials.email,
              password: hashedPassword,
              name: credentials.name || "Student",
            })
            .select()
            .single();
          if (error) throw new Error("Sign up failed!");
          return { id: newUser.id, email: newUser.email, name: newUser.name };
        }

        if (!existingUser) throw new Error("Email not found!");
        const isValid = await bcrypt.compare(credentials.password, existingUser.password);
        if (!isValid) throw new Error("Wrong password!");
        return { id: existingUser.id, email: existingUser.email, name: existingUser.name };
      },
    }),
  ],
  pages: { signIn: "/login" },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) { return session; },
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
  },
});

export { handler as GET, handler as POST };