import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";

// Supabaseクライアントを作成（サービスロールキーを使用）
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabase: any = null;

// Supabaseクライアントを遅延初期化
function getSupabaseClient() {
  if (!supabase && supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return supabase;
}

export async function middleware(request: NextRequest) {
  // API routes を除外（認証が必要ないエンドポイント）
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Next.js内部ファイルも除外
  if (request.nextUrl.pathname.startsWith("/_next/")) {
    return NextResponse.next();
  }

  // Authorization ヘッダーを取得
  const authorizationHeader = request.headers.get("authorization");

  // Basic認証のチェック
  if (!authorizationHeader || !authorizationHeader.startsWith("Basic ")) {
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  try {
    // Base64でエンコードされた認証情報をデコード
    const base64Credentials = authorizationHeader.split(" ")[1];
    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [username, password] = credentials.split(":");

    // 本番環境: Supabaseで認証
    if (supabaseUrl && supabaseServiceKey) {
      const supabaseClient = getSupabaseClient();

      if (supabaseClient) {
        const { data, error } = await supabaseClient.rpc("verify_password", {
          username: username,
          password: password,
        });

        if (error) {
          return new NextResponse("Invalid credentials", {
            status: 401,
            headers: {
              "WWW-Authenticate": 'Basic realm="Secure Area"',
              "Content-Type": "text/plain; charset=utf-8",
            },
          });
        }

        if (data === true) {
          return NextResponse.next();
        } else {
          return new NextResponse("Invalid credentials", {
            status: 401,
            headers: {
              "WWW-Authenticate": 'Basic realm="Secure Area"',
              "Content-Type": "text/plain; charset=utf-8",
            },
          });
        }
      }
    }

    // 開発環境: 環境変数で認証
    const authUsername = process.env.AUTH_USERNAME;
    const authPasswordHash = process.env.AUTH_PASSWORD_HASH;

    if (authUsername && authPasswordHash) {
      // ユーザー名の確認
      if (username !== authUsername) {
        return new NextResponse("Invalid credentials", {
          status: 401,
          headers: {
            "WWW-Authenticate": 'Basic realm="Secure Area"',
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      }

      // パスワードのハッシュ比較
      const isPasswordValid = bcrypt.compareSync(password, authPasswordHash);

      if (!isPasswordValid) {
        return new NextResponse("Invalid credentials", {
          status: 401,
          headers: {
            "WWW-Authenticate": 'Basic realm="Secure Area"',
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      }

      return NextResponse.next();
    }

    // 認証情報が設定されていない場合も401エラーで認証プロンプトを表示
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    return new NextResponse("Invalid credentials", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }
}

// ミドルウェアを適用するパスの設定
export const config = {
  matcher: [
    // すべてのルートに適用（Next.js内部ファイルとAPIは除外）
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|manifest.json).*)",
  ],
};
