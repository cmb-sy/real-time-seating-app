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
    // 現在の曜日を取得（0=月曜日）
    const today = new Date();
    const todayWeekday = today.getDay() === 0 ? 6 : today.getDay() - 1; // 日曜日を6に変換
    const tomorrowWeekday = (todayWeekday + 1) % 7;

    const weekdayNames = [
      "月曜",
      "火曜",
      "水曜",
      "木曜",
      "金曜",
      "土曜",
      "日曜",
    ];

    // サンプルデータ（平日のみ）
    const samplePredictions: {
      [key: number]: { density_rate: number; occupied_seats: number };
    } = {
      0: { density_rate: 0.75, occupied_seats: 45 }, // 月曜
      1: { density_rate: 0.65, occupied_seats: 39 }, // 火曜
      2: { density_rate: 0.8, occupied_seats: 48 }, // 水曜
      3: { density_rate: 0.7, occupied_seats: 42 }, // 木曜
      4: { density_rate: 0.55, occupied_seats: 33 }, // 金曜
    };

    // 予測データの構築
    const predictions: any = {};

    // 今日の予測
    if (todayWeekday <= 4) {
      // 月-金
      predictions.today = {
        day_of_week: todayWeekday,
        weekday_name: weekdayNames[todayWeekday],
        predictions: samplePredictions[todayWeekday] || {
          density_rate: 0.65,
          occupied_seats: 39,
        },
      };
    } else {
      predictions.today = {
        day_of_week: todayWeekday,
        weekday_name: weekdayNames[todayWeekday],
        predictions: null,
        message: "土日は予測データがありません",
      };
    }

    // 明日の予測
    if (tomorrowWeekday <= 4) {
      // 月-金
      predictions.tomorrow = {
        day_of_week: tomorrowWeekday,
        weekday_name: weekdayNames[tomorrowWeekday],
        predictions: samplePredictions[tomorrowWeekday] || {
          density_rate: 0.65,
          occupied_seats: 39,
        },
      };
    } else {
      predictions.tomorrow = {
        day_of_week: tomorrowWeekday,
        weekday_name: weekdayNames[tomorrowWeekday],
        predictions: null,
        message: "土日は予測データがありません",
      };
    }

    return NextResponse.json(
      {
        success: true,
        data: predictions,
        message: "今日と明日の予測データを取得しました (サンプルデータ)",
      },
      { status: 200, headers }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "今日明日予測エラーが発生しました",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500, headers }
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
