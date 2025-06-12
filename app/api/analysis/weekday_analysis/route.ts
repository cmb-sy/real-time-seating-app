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
    // density_historyテーブルから実際のデータを取得
    const { data: historyData, error } = await supabaseAdmin
      .from("density_history")
      .select("day_of_week, occupied_seats, density_rate, created_at")
      .order("created_at", { ascending: false })
      .limit(200); // 最新200件を取得

    if (error) {
      console.error("履歴データの取得に失敗:", error);
      throw new Error(`履歴データの取得に失敗: ${error.message}`);
    }

    // 曜日別の統計を計算
    const weekdayStats: {
      [key: number]: { density_rates: number[]; occupied_seats: number[] };
    } = {};

    // データを曜日別に分類（平日のみ）
    historyData?.forEach((record) => {
      // 平日のみ（月曜=0, 火曜=1, 水曜=2, 木曜=3, 金曜=4）
      if (record.day_of_week >= 0 && record.day_of_week <= 4) {
        if (!weekdayStats[record.day_of_week]) {
          weekdayStats[record.day_of_week] = {
            density_rates: [],
            occupied_seats: [],
          };
        }
        weekdayStats[record.day_of_week].density_rates.push(
          record.density_rate
        );
        weekdayStats[record.day_of_week].occupied_seats.push(
          record.occupied_seats
        );
      }
    });

    const weekdayNames = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日"];

    // 日別予測データを構築
    const dailyPredictions: { [key: string]: any } = {};
    let totalDensitySum = 0;
    let totalOccupiedSum = 0;
    let validDaysCount = 0;
    let recordCount = 0;

    for (let dayOfWeek = 0; dayOfWeek <= 4; dayOfWeek++) {
      const dayName = weekdayNames[dayOfWeek];
      const stats = weekdayStats[dayOfWeek];

      if (stats && stats.density_rates.length > 0) {
        recordCount = stats.density_rates.length;

        // 平均値の計算
        const avgDensityRate =
          Math.round(
            (stats.density_rates.reduce((sum, val) => sum + val, 0) /
              stats.density_rates.length) *
              100
          ) / 100;
        const avgOccupiedSeats =
          Math.round(
            (stats.occupied_seats.reduce((sum, val) => sum + val, 0) /
              stats.occupied_seats.length) *
              100
          ) / 100;

        dailyPredictions[dayName] = {
          レコード数: recordCount,
          predictions: {
            density_rate: avgDensityRate,
            occupied_seats: avgOccupiedSeats,
          },
        };

        totalDensitySum += avgDensityRate;
        totalOccupiedSum += avgOccupiedSeats;
        validDaysCount++;
      } else {
        dailyPredictions[dayName] = {
          レコード数: 0,
          predictions: null,
          message: "この曜日の履歴データがありません",
        };
      }
    }

    // 全体サマリーの計算
    const summary = {
      全体: {
        record_count: recordCount,
        density_rate_mean:
          validDaysCount > 0
            ? Math.round((totalDensitySum / validDaysCount) * 100) / 100
            : 0,
        occupied_seats_mean:
          validDaysCount > 0
            ? Math.round((totalOccupiedSum / validDaysCount) * 100) / 100
            : 0,
      },
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          detailed_stats: {}, // 詳細統計は空オブジェクト（仕様書通り）
          daily_predictions: dailyPredictions,
          summary: summary,
        },
        message: "機械学習モデルによる曜日別予測",
      },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("曜日別分析エラー:", error);
    return NextResponse.json(
      {
        success: false,
        error: "曜日別分析エラーが発生しました",
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
