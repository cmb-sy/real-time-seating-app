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

    const weekdayNames = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日"];

    // 日別予測データと週間平均データを構築
    const weekdayPredictions: { [key: string]: any } = {};
    const weeklyAverages = [];
    let totalDensitySum = 0;
    let totalOccupiedSum = 0;
    let validDaysCount = 0;
    let maxOccupancyRate = 0;
    let minOccupancyRate = 1;
    let mostBusyDay = null;
    let leastBusyDay = null;

    for (let dayOfWeek = 0; dayOfWeek <= 4; dayOfWeek++) {
      const dayName = weekdayNames[dayOfWeek];
      const stats = weekdayStats[dayOfWeek];

      if (stats && stats.density_rates.length > 0) {
        const densityStats = calculateStats(stats.density_rates);
        const occupiedStats = calculateStats(stats.occupied_seats);
        const densityRate = densityStats.平均;
        const occupiedSeats = occupiedStats.平均;
        const occupancyRate = densityRate / 100;

        // 最も混雑している/空いている曜日を記録
        if (occupancyRate > maxOccupancyRate) {
          maxOccupancyRate = occupancyRate;
          mostBusyDay = {
            weekday: dayOfWeek,
            weekday_name: dayName,
            occupancy_rate: occupancyRate,
          };
        }

        if (occupancyRate < minOccupancyRate) {
          minOccupancyRate = occupancyRate;
          leastBusyDay = {
            weekday: dayOfWeek,
            weekday_name: dayName,
            occupancy_rate: occupancyRate,
          };
        }

        // 従来のフォーマット（互換性のため）
        weekdayPredictions[dayName] = {
          day_of_week: dayOfWeek,
          weekday_name: dayName,
          predictions: {
            density_rate: densityRate,
            occupied_seats: occupiedSeats,
          },
          レコード数: stats.density_rates.length,
          density_rate: densityStats,
          occupied_seats: occupiedStats,
        };

        // 新しいフォーマット（仕様書通り）
        weeklyAverages.push({
          weekday: dayOfWeek,
          weekday_name: dayName,
          prediction: {
            occupancy_rate: Math.round(occupancyRate * 100) / 100,
            available_seats: 100 - Math.ceil(occupiedSeats),
            status:
              occupancyRate < 0.3
                ? "available"
                : occupancyRate < 0.7
                ? "moderate"
                : "busy",
            confidence: "medium",
            data_points: stats.density_rates.length,
          },
        });

        totalDensitySum += densityRate;
        totalOccupiedSum += occupiedSeats;
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
    const averageDensity =
      validDaysCount > 0
        ? Math.round((totalDensitySum / validDaysCount) * 10) / 10
        : 0;
    const averageOccupied =
      validDaysCount > 0
        ? Math.round((totalOccupiedSum / validDaysCount) * 10) / 10
        : 0;
    const averageOccupancy = averageDensity / 100;

    // 週平均データと推奨メッセージ
    let recommendation = "";
    if (averageOccupancy < 0.3) {
      recommendation =
        "全体的に空いています。最も混雑するのは" +
        (mostBusyDay?.weekday_name || "なし") +
        "ですが、それでも比較的余裕があります。";
    } else if (averageOccupancy < 0.7) {
      recommendation =
        "全体的に適度な混雑です。" +
        (leastBusyDay?.weekday_name || "なし") +
        "が最も空いています。";
    } else {
      recommendation =
        "全体的に混雑しています。可能であれば" +
        (leastBusyDay?.weekday_name || "なし") +
        "の利用をお勧めします。";
    }

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        data: {
          weekly_averages: weeklyAverages,
          summary: {
            most_busy_day: mostBusyDay,
            least_busy_day: leastBusyDay,
            average_occupancy: Math.round(averageOccupancy * 100) / 100,
            recommendation: recommendation,
          },
          // 互換性のため残す
          daily_predictions: weekdayPredictions,
        },
        metadata: {
          model_version: "1.0.0",
          last_updated: new Date().toISOString(),
          features_used: ["day_of_week"],
          data_source: "ml_model",
        },
        message: "機械学習モデルによる曜日別予測",
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
