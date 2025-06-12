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

    // 統計計算関数
    const calculateStats = (numbers: number[]) => {
      if (numbers.length === 0)
        return { 平均: 0, 中央値: 0, 標準偏差: 0, 最小: 0, 最大: 0 };

      const sorted = [...numbers].sort((a, b) => a - b);
      const mean = numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
      const median =
        sorted.length % 2 === 0
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)];

      const variance =
        numbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) /
        numbers.length;
      const stdDev = Math.sqrt(variance);

      return {
        平均: Math.round(mean * 10) / 10,
        中央値: Math.round(median * 10) / 10,
        標準偏差: Math.round(stdDev * 10) / 10,
        最小: Math.min(...numbers),
        最大: Math.max(...numbers),
      };
    };

    const weekdayNames = ["月曜", "火曜", "水曜", "木曜", "金曜"];

    // 日別予測データを構築
    const weekdayPredictions: { [key: string]: any } = {};
    let totalDensitySum = 0;
    let totalOccupiedSum = 0;
    let validDaysCount = 0;

    for (let dayOfWeek = 0; dayOfWeek <= 4; dayOfWeek++) {
      const dayName = weekdayNames[dayOfWeek];
      const stats = weekdayStats[dayOfWeek];

      if (stats && stats.density_rates.length > 0) {
        const densityStats = calculateStats(stats.density_rates);
        const occupiedStats = calculateStats(stats.occupied_seats);

        weekdayPredictions[dayName] = {
          day_of_week: dayOfWeek, // そのまま使用（月曜=0）
          weekday_name: dayName,
          predictions: {
            density_rate: densityStats.平均,
            occupied_seats: occupiedStats.平均,
          },
          レコード数: stats.density_rates.length,
          density_rate: densityStats,
          occupied_seats: occupiedStats,
        };

        totalDensitySum += densityStats.平均;
        totalOccupiedSum += occupiedStats.平均;
        validDaysCount++;
      } else {
        weekdayPredictions[dayName] = {
          day_of_week: dayOfWeek,
          weekday_name: dayName,
          predictions: null,
          message: "この曜日の履歴データがありません",
        };
      }
    }

    // 週平均の計算
    const weeklyAverage = {
      average_density_rate:
        validDaysCount > 0
          ? Math.round((totalDensitySum / validDaysCount) * 10) / 10
          : 0,
      average_occupied_seats:
        validDaysCount > 0
          ? Math.round((totalOccupiedSum / validDaysCount) * 10) / 10
          : 0,
      total_weekdays: validDaysCount,
      total_records: historyData?.length || 0,
    };

    return NextResponse.json(
      {
        success: true,
        data: {
          weekly_average: weeklyAverage,
          daily_predictions: weekdayPredictions,
        },
        message: `週平均予測データを取得しました (履歴データ${
          historyData?.length || 0
        }件から算出)`,
      },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("週平均予測エラー:", error);
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
