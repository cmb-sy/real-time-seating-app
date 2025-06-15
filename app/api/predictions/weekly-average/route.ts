import { NextRequest, NextResponse } from "next/server";

// このAPIルートは削除予定 - フロントエンドから直接APIサーバーに接続
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      success: false,
      error:
        "このAPIルートは廃止されました。フロントエンドから直接APIサーバーに接続してください。",
      data: null,
    },
    { status: 410 } // Gone
  );
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
