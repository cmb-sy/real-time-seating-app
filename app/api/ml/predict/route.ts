import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  // CORS ヘッダーを設定
  const headers = new Headers({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, Origin",
    "Content-Type": "application/json",
  });

  try {
    // day_of_weekパラメータの取得
    const url = new URL(request.url);
    const dayOfWeekParam = url.searchParams.get("day_of_week");

    if (!dayOfWeekParam) {
      return NextResponse.json(
        {
          success: false,
          error: "day_of_weekパラメータが必要です",
          message:
            "曜日を指定してください（0: 月曜, 1: 火曜, 2: 水曜, 3: 木曜, 4: 金曜）",
        },
        { status: 400, headers }
      );
    }

    const dayOfWeek = parseInt(dayOfWeekParam);

    // 有効な曜日かチェック（0-4: 月-金）
    if (isNaN(dayOfWeek) || dayOfWeek < 0 || dayOfWeek > 4) {
      return NextResponse.json(
        {
          success: false,
          error: "無効な曜日パラメータです",
          message:
            "曜日は0から4の間である必要があります（0: 月曜, 1: 火曜, 2: 水曜, 3: 木曜, 4: 金曜）",
        },
        { status: 400, headers }
      );
    }

    // density_historyテーブルから実際のデータを取得
    const { data: historyData, error } = await supabaseAdmin
      .from("density_history")
      .select("day_of_week, occupied_seats, density_rate")
      .eq("day_of_week", dayOfWeek)
      .order("created_at", { ascending: false })
      .limit(100); // 最新100件を取得

    if (error) {
      console.error("履歴データの取得に失敗:", error);
      throw new Error(`履歴データの取得に失敗: ${error.message}`);
    }

    // 曜日の名前マッピング
    const weekdayNames = ["月", "火", "水", "木", "金"];
    const weekdayName = weekdayNames[dayOfWeek];

    // データが存在する場合は平均を計算
    if (historyData && historyData.length > 0) {
      // 平均値を計算
      const densityRates = historyData.map((record) => record.density_rate);
      const occupiedSeats = historyData.map((record) => record.occupied_seats);

      const avgDensityRate =
        Math.round(
          (densityRates.reduce((sum, val) => sum + val, 0) /
            densityRates.length) *
            100
        ) / 100;
      const avgOccupiedSeats =
        Math.round(
          (occupiedSeats.reduce((sum, val) => sum + val, 0) /
            occupiedSeats.length) *
            100
        ) / 100;

      return NextResponse.json(
        {
          success: true,
          day_of_week: dayOfWeek,
          weekday_name: weekdayName,
          predictions: {
            density_rate: avgDensityRate,
            occupied_seats: Math.round(avgOccupiedSeats),
          },
          message: "機械学習モデルによる予測",
        },
        { status: 200, headers }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          day_of_week: dayOfWeek,
          weekday_name: weekdayName,
          predictions: null,
          message: "この曜日のデータが見つかりませんでした",
        },
        { status: 404, headers }
      );
    }
  } catch (error) {
    console.error("予測エラー:", error);
    return NextResponse.json(
      {
        success: false,
        error: "予測エラーが発生しました",
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
