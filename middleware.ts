import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'

// Basic認証のヘルパー関数
function parseBasicAuth(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return null
  }

  const base64Credentials = authHeader.split(' ')[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
  const [username, password] = credentials.split(':')

  return { username, password }
}

// Basic認証のミドルウェア
export async function middleware(request: NextRequest) {
  // 認証が必要なパスかどうかを確認
  const path = request.nextUrl.pathname
  const isAuthRequired = !path.startsWith('/_next') && 
                        !path.startsWith('/favicon.ico')

  if (!isAuthRequired) {
    return NextResponse.next()
  }

  // Basic認証ヘッダーを取得
  const authHeader = request.headers.get('authorization')
  const credentials = parseBasicAuth(authHeader)

  if (!credentials) {
    // 認証情報がない場合は401を返す
    return new NextResponse(null, {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    })
  }

  try {
    // Supabaseのloginテーブルで認証情報を確認
    const { data, error } = await supabase
      .from('login')
      .select('id, pass')
      .eq('id', credentials.username)
      .eq('pass', credentials.password)
      .single()

    if (error || !data) {
      // 認証失敗
      return new NextResponse(null, {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
      })
    }

    // 認証成功
    return NextResponse.next()
  } catch (error) {
    console.error('認証エラー:', error)
    return new NextResponse(null, {
      status: 500,
      headers: {
        'WWW-Authenticate': 'Basic realm="Secure Area"',
      },
    })
  }
}

// 全てのパスに対してミドルウェアを適用
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
