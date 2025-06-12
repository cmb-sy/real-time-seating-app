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
    // サンプルデータ
    const weekdayPredictions = {
      月曜: {
        day_of_week: 0,
        weekday_name: "月曜",
        predictions: { density_rate: 0.75, occupied_seats: 45 },
      },
      火曜: {
        day_of_week: 1,
        weekday_name: "火曜",
        predictions: { density_rate: 0.65, occupied_seats: 39 },
      },
      水曜: {
        day_of_week: 2,
        weekday_name: "水曜",
        predictions: { density_rate: 0.8, occupied_seats: 48 },
      },
      木曜: {
        day_of_week: 3,
        weekday_name: "木曜",
        predictions: { density_rate: 0.7, occupied_seats: 42 },
      },
      金曜: {
        day_of_week: 4,
        weekday_name: "金曜",
        predictions: { density_rate: 0.55, occupied_seats: 33 },
      },
    };

    // 週平均の計算
    const weeklyAverage = {
      average_density_rate: 0.69,
      average_occupied_seats: 41.4,
      total_weekdays: 5,
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          weekly_average: weeklyAverage,
          daily_predictions: weekdayPredictions,
        },
        message: "週平均予測データを取得しました (サンプルデータ)",
      },
      { status: 200, headers }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "週平均予測エラーが発生しました",
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
