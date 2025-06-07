import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Basic認証",
      credentials: {
        username: { label: "ユーザー名", type: "text" },
        password: { label: "パスワード", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("認証情報が必要です");
        }

        try {
          // Supabaseのloginテーブルから認証情報を取得
          const { data, error } = await supabase
            .from("login")
            .select("id, pass")
            .eq("id", credentials.username)
            .eq("pass", credentials.password)
            .single();

          if (error || !data) {
            throw new Error("認証に失敗しました");
          }

          // 認証成功した場合、ユーザー情報を返す
          return {
            id: data.id,
            name: data.id,
          };
        } catch (error) {
          console.error("認証エラー:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login", // エラーページ
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 24 * 60 * 60, // 24時間
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  events: {
    async signIn({ user }: { user: { id: string } }) {
      console.log("認証成功:", user.id);
    },
    async signOut({ token }: { token: { id: string } }) {
      console.log("認証解除:", token.id);
    },
  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
