import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // パスワード検証用の関数を呼び出し
          const { data, error } = await supabase.rpc("verify_password", {
            username: credentials.username,
            password: credentials.password,
          });

          if (error) {
            console.error("認証エラー:", error);
            return null;
          }

          // パスワードが正しい場合
          if (data === true) {
            return {
              id: credentials.username,
              name: credentials.username,
            };
          }

          return null;
        } catch (error) {
          console.error("認証エラー:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
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
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  // 本番環境での必須シークレット（JWT署名用）を追加
  secret: process.env.NEXTAUTH_SECRET || "THIS_IS_AN_EXAMPLE_SECRET_REPLACE_ME",
});

export { handler as GET, handler as POST };
