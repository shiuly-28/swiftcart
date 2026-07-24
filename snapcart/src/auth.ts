import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import connectDb from "./lib/db";
import User from "./models/user.models";
import bcrypt from "bcryptjs";
import Google from "next-auth/providers/google";

declare module "next-auth" {
  interface User {
    id: string;
    role: string;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: string;
    };
  }
  interface JWT {
    id: string;
    role: string;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDb();
        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await User.findOne({ email });
        if (!user) throw new Error("User does not exist");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Incorrect password");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role || "user",
        };
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDb();
        let dbUser = await User.findOne({ email: user.email });
        if (!dbUser) {
          dbUser = await User.create({
            name: user.name,
            email: user.email,
            image: user.image,
          });
        }
        user.id = dbUser._id.toString();
        user.role = dbUser.role || "user";
      }
      return true;
    },
    jwt({ token, user, trigger, session }) {
  if (user) {
    token.id = user.id;
    token.name = user.name as string;
    token.email = user.email as string;
    token.role = (user as any).role || "";
    console.log("JWT token role:", token.role); // যোগ করো
  }
  if (trigger === "update" && session?.role) {
    token.role = session.role;
  }
  return token;
},
session({ session, token }) {
  if (session.user) {
    session.user.id = token.id as string;
    session.user.name = token.name as string;
    session.user.email = token.email as string;
    session.user.role = (token.role as string) || "";
    console.log("Session role:", session.user.role); // যোগ করো
  }
  return session;
},
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 10 * 24 * 60 * 60,
  },
  secret: process.env.AUTH_SECRET,
});