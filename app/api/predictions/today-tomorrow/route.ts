import { NextRequest, NextResponse } from "next/server";

const ML_BACKEND_URL = "https://real-time-seating-app-ml.vercel.app";

// CORSヘッダーを設定する関数
const setCorsHeaders = () => ({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
});

// このAPIルートは削除予定 - フロントエンドから直接APIサーバーに接続
export async function GET(request: NextRequest) {
  try {
    // MLバックエンドから今日・明日の予測データを取得
    const response = await fetch(
      `${ML_BACKEND_URL}/api/predictions/today-tomorrow`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // CORSエラーを回避するため、サーバーサイドでフェッチ
      }
    );

    if (!response.ok) {
      throw new Error(`MLサーバーエラー: ${response.status}`);
    }

    const data = await response.json();

    // CORSヘッダーを追加してレスポンス
    return NextResponse.json(data, {
      status: 200,
      headers: setCorsHeaders(),
    });
  } catch (error) {
    console.error("今日・明日の予測データ取得エラー:", error);

    // エラー時はダミーデータを返す
    const dummyData = {
      success: false,
      error: "MLサーバーに接続できません",
      data: {
        today: {
          date: new Date().toISOString().split("T")[0],
          day_of_week: "不明",
          occupancy_rate: 0,
          occupied_seats: 0,
        },
        tomorrow: {
          date: new Date(Date.now() + 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          day_of_week: "不明",
          occupancy_rate: 0,
          occupied_seats: 0,
        },
      },
    };

    return NextResponse.json(dummyData, {
      status: 503,
      headers: setCorsHeaders(),
    });
  }
}

// OPTIONSメソッド（CORSプリフライト）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: setCorsHeaders(),
  });
}
