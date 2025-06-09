import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // API routes を除外（認証が必要ないエンドポイント）
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.next();
    }

    // Next.js内部ファイルも除外
    if (request.nextUrl.pathname.startsWith("/_next/")) {
      return NextResponse.next();
    }

    // 静的ファイルも除外
    if (
      request.nextUrl.pathname.match(
        /\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/
      )
    ) {
      return NextResponse.next();
    }

    // デバッグ用: 環境変数の存在確認
    const authUsername = process.env.AUTH_USERNAME;
    const authPasswordHash = process.env.AUTH_PASSWORD_HASH;

    // 本番環境でのデバッグ（一時的）
    if (process.env.NODE_ENV === "production") {
      console.log("Production Debug - Environment variables check:", {
        hasAuthUsername: !!authUsername,
        hasAuthPasswordHash: !!authPasswordHash,
        authUsernameLength: authUsername?.length || 0,
        authPasswordHashPrefix: authPasswordHash?.substring(0, 10) || "none",
      });
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

    // Base64でエンコードされた認証情報をデコード
    const base64Credentials = authorizationHeader.split(" ")[1];
    if (!base64Credentials) {
      return new NextResponse("Invalid authentication format", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Secure Area"',
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    const credentials = Buffer.from(base64Credentials, "base64").toString(
      "ascii"
    );
    const [username, password] = credentials.split(":");

    if (!username || !password) {
      return new NextResponse("Invalid credentials format", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Secure Area"',
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }

    // 本番環境でのデバッグ（一時的）
    if (process.env.NODE_ENV === "production") {
      console.log("Production Debug - Credentials received:", {
        username: username,
        passwordLength: password?.length || 0,
        expectedUsername: authUsername,
      });
    }

    // 環境変数で認証
    if (authUsername && authPasswordHash) {
      // ユーザー名の確認
      if (username !== authUsername) {
        if (process.env.NODE_ENV === "production") {
          console.log("Production Debug - Username mismatch");
        }
        return new NextResponse("Invalid credentials", {
          status: 401,
          headers: {
            "WWW-Authenticate": 'Basic realm="Secure Area"',
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      }

      // bcryptを安全にインポート
      try {
        const bcrypt = await import("bcryptjs");
        const isPasswordValid = bcrypt.default.compareSync(
          password,
          authPasswordHash
        );

        // 本番環境でのデバッグ（一時的）
        if (process.env.NODE_ENV === "production") {
          console.log("Production Debug - Password validation:", {
            isValid: isPasswordValid,
            providedPassword: password,
            hashPrefix: authPasswordHash.substring(0, 15),
          });
        }

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
      } catch (bcryptError) {
        if (process.env.NODE_ENV === "production") {
          console.error("Production Debug - bcrypt error:", bcryptError);
        }
        return new NextResponse("Authentication error", {
          status: 401,
          headers: {
            "WWW-Authenticate": 'Basic realm="Secure Area"',
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      }
    }

    // Supabaseで認証を試行
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      try {
        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        });

        const { data, error } = await supabase.rpc("verify_password", {
          username: username,
          password: password,
        });

        if (error) {
          if (process.env.NODE_ENV === "production") {
            console.log("Production Debug - Supabase error:", error);
          }
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
      } catch (supabaseError) {
        if (process.env.NODE_ENV === "production") {
          console.error(
            "Production Debug - Supabase connection error:",
            supabaseError
          );
        }
        return new NextResponse("Authentication required", {
          status: 401,
          headers: {
            "WWW-Authenticate": 'Basic realm="Secure Area"',
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      }
    }

    // 認証情報が全く設定されていない場合
    if (process.env.NODE_ENV === "production") {
      console.log("Production Debug - No authentication method available");
    }
    return new NextResponse("Authentication required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      console.error("Production Debug - Middleware error:", error);
    }
    return new NextResponse("Authentication required", {
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
