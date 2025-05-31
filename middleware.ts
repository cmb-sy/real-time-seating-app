import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// NextAuthベースの認証チェック
export async function middleware(request: NextRequest) {
  // NextAuth JWT トークンを取得
  const token = await getToken({ req: request })
  const isAuthenticated = !!token
  
  // 現在のパス
  const path = request.nextUrl.pathname
  
  // ログインページへのアクセスかどうか
  const isLoginPage = path === '/login'
  
  // 認証が必要なページでトークンがない場合はログインページへリダイレクト
  if (!isAuthenticated && !isLoginPage) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(loginUrl)
  }
  
  // すでに認証されていて、ログインページにアクセスした場合はホームページへリダイレクト
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  return NextResponse.next()
}

// 認証が必要なルートとログインページ用の設定
export const config = {
  matcher: [
    // 保護するルート
    '/admin/:path*',
    '/seat-management', 
    
    // ログインページ
    '/login'
    
    // 全てのページを保護する場合（ログイン、API、静的ファイル以外）
    // '/((?!api|_next/static|_next/image|favicon.ico|login).*)' 
  ]
}
