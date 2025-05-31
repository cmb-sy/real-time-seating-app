import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      // 表示名
      name: "ユーザー名とパスワード",
      credentials: {
        username: { label: "ユーザー名", type: "text" },
        password: { label: "パスワード", type: "password" }
      },
      async authorize(credentials) {
        // 環境変数から認証情報を取得
        const validUsername = process.env.AUTH_USERNAME || "admin"
        const validPassword = process.env.AUTH_PASSWORD || "password123"
        
        // 認証情報の検証
        if (credentials?.username === validUsername && 
            credentials?.password === validPassword) {
          // 認証成功した場合、ユーザー情報を返す
          return { 
            id: "1", 
            name: validUsername, 
            email: `${validUsername}@example.com` 
          }
        }
        
        // 認証失敗
        return null
      }
    })
  ],
  pages: {
    signIn: "/login", // カスタムサインインページ
  },
  session: {
    strategy: "jwt" as const, // JWT を使用する
    maxAge: 30 * 24 * 60 * 60, // 30日間
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id
      }
      return session
    },
  },
}

export const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
