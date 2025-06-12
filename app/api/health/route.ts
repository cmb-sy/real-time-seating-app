import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // CORS ヘッダーを設定
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin",
    "Content-Type": "application/json",
  });

  try {
    return NextResponse.json(
      {
        status: "healthy",
        database: "simulated",
        models_loaded: false,
        available_models: [],
        environment: "production-lite",
        message: "軽量化されたAPIが正常に動作しています",
        timestamp: new Date().toISOString(),
      },
      { status: 200, headers }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503, headers }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  // プリフライトリクエスト対応
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin",
    },
  });
}
