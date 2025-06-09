import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export function middleware(request: NextRequest) {
  // API routes を除外（認証が必要ないエンドポイント）
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Basic認証のための環境変数をチェック
  const basicAuthUser = process.env.AUTH_USERNAME;
  const basicAuthPasswordHash = process.env.AUTH_PASSWORD_HASH;

  // 環境変数が設定されていない場合はBasic認証をスキップ
  if (!basicAuthUser || !basicAuthPasswordHash) {
    console.warn(
      "⚠️ AUTH_USERNAME or AUTH_PASSWORD_HASH not set, Basic Auth disabled"
    );
    return NextResponse.next();
  }

  // Authorization ヘッダーを取得
  const authorizationHeader = request.headers.get("authorization");

  // Basic認証のチェック
  if (!authorizationHeader || !authorizationHeader.startsWith("Basic ")) {
    // Basic認証が必要な場合のレスポンス
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  // Base64でエンコードされた認証情報をデコード
  const base64Credentials = authorizationHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "ascii"
  );
  const [username, password] = credentials.split(":");

  // 認証情報を検証
  // ユーザー名の確認
  if (username !== basicAuthUser) {
    return new NextResponse("Invalid credentials", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  // パスワードのハッシュ比較
  const isPasswordValid = bcrypt.compareSync(password, basicAuthPasswordHash);
  if (!isPasswordValid) {
    return new NextResponse("Invalid credentials", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  // 認証成功時は次の処理に進む
  return NextResponse.next();
}

// ミドルウェアを適用するパスの設定
export const config = {
  matcher: [
    // 静的ファイルとAPIルートを除外
    "/((?!api|_next/static|_next/image|favicon.ico|favicon.svg).*)",
  ],
};
