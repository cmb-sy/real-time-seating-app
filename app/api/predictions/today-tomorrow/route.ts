import { NextRequest, NextResponse } from "next/server";

const ML_BACKEND_URL = "https://real-time-seating-app-ml.vercel.app";

// CORSヘッダーを設定する関数
const setCorsHeaders = () => ({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
});

// OPTIONSメソッド（CORSプリフライト）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: setCorsHeaders(),
  });
}

// MLサーバーのレスポンスをフロントエンド形式に変換
const transformTodayTomorrowResponse = (data: any) => {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  return {
    success: true,
    data: {
      today: {
        date: today.toISOString().split("T")[0],
        day_of_week: data.data.today.weekday_name,
        occupancy_rate: data.data.today.occupancy_rate,
        occupied_seats: data.data.today.occupied_seats,
      },
      tomorrow: {
        date: tomorrow.toISOString().split("T")[0],
        day_of_week: data.data.tomorrow.weekday_name,
        occupancy_rate: data.data.tomorrow.occupancy_rate,
        occupied_seats: data.data.tomorrow.occupied_seats,
      },
    },
  };
};

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

    // MLサーバーのレスポンスをフロントエンド形式に変換
    const transformedData = transformTodayTomorrowResponse(data);

    // CORSヘッダーを追加してレスポンス
    return NextResponse.json(transformedData, {
      status: 200,
      headers: setCorsHeaders(),
    });
  } catch (error) {
    console.error("今日・明日の予測データ取得エラー:", error);

    // エラーレスポンスを返す（ダミーデータなし）
    const errorResponse = {
      success: false,
      error:
        error instanceof Error ? error.message : "MLサーバーに接続できません",
      data: null,
    };

    return NextResponse.json(errorResponse, {
      status: 503,
      headers: setCorsHeaders(),
    });
  }
}
