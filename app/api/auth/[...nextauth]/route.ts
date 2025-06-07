import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "@/lib/supabase";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          const { data, error } = await supabase
            .from('login')
            .select('id, pass')
            .eq('id', credentials.username)
            .filter('pass', 'eq', supabase.rpc('crypt', {
              password: credentials.password,
              salt: supabase.from('login').select('pass').eq('id', credentials.username).single()
            }))
            .single();

          if (error || !data) {
            return null;
          }

          return {
            id: data.id,
            name: data.id,
          };
        } catch (error) {
          console.error('認証エラー:', error);
          return null;
        }
      }
    })
  ],
  pages: {
    signIn: '/auth/signin',
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
    }
  }
});

export { handler as GET, handler as POST }; 