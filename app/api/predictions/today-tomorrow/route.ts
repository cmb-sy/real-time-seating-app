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

    // density_historyテーブルから実際のデータを取得
    const { data: historyData, error } = await supabaseAdmin
      .from("density_history")
      .select("day_of_week, occupied_seats, density_rate")
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

    // データを曜日別に分類
    historyData?.forEach((record) => {
      if (!weekdayStats[record.day_of_week]) {
        weekdayStats[record.day_of_week] = {
          density_rates: [],
          occupied_seats: [],
        };
      }
      weekdayStats[record.day_of_week].density_rates.push(record.density_rate);
      weekdayStats[record.day_of_week].occupied_seats.push(
        record.occupied_seats
      );
    });

    // 平均値を計算する関数
    const calculateAverage = (numbers: number[]): number => {
      if (numbers.length === 0) return 0;
      return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    };

    // 予測データの構築
    const predictions: any = {};
    const formattedToday = today.toISOString().split("T")[0]; // YYYY-MM-DD形式
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const formattedTomorrow = tomorrow.toISOString().split("T")[0]; // YYYY-MM-DD形式

    // 今日の予測
    if (todayWeekday <= 4) {
      // データベースの曜日定義と一致（月曜=0, 火曜=1, ..., 金曜=4）
      const todayStats = weekdayStats[todayWeekday];
      if (todayStats && todayStats.density_rates.length > 0) {
        const densityRate =
          Math.round(calculateAverage(todayStats.density_rates) * 10) / 10;
        const occupiedSeats =
          Math.round(calculateAverage(todayStats.occupied_seats) * 10) / 10;
        predictions.today = {
          date: formattedToday,
          day_of_week: todayWeekday,
          weekday_name: weekdayNames[todayWeekday],
          predictions: {
            density_rate: densityRate,
            occupied_seats: occupiedSeats,
          },
        };
      } else {
        predictions.today = {
          date: formattedToday,
          day_of_week: todayWeekday,
          weekday_name: weekdayNames[todayWeekday],
          predictions: null,
          message: "この曜日の履歴データがありません",
        };
      }
    } else {
      predictions.today = {
        date: formattedToday,
        day_of_week: todayWeekday,
        weekday_name: weekdayNames[todayWeekday],
        predictions: null,
        message: "土日は予測データがありません",
      };
    }

    // 明日の予測
    if (tomorrowWeekday <= 4) {
      // データベースの曜日定義と一致（月曜=0, 火曜=1, ..., 金曜=4）
      const tomorrowStats = weekdayStats[tomorrowWeekday];
      if (tomorrowStats && tomorrowStats.density_rates.length > 0) {
        const densityRate =
          Math.round(calculateAverage(tomorrowStats.density_rates) * 10) / 10;
        const occupiedSeats =
          Math.round(calculateAverage(tomorrowStats.occupied_seats) * 10) / 10;
        predictions.tomorrow = {
          date: formattedTomorrow,
          day_of_week: tomorrowWeekday,
          weekday_name: weekdayNames[tomorrowWeekday],
          predictions: {
            density_rate: densityRate,
            occupied_seats: occupiedSeats,
          },
        };
      } else {
        predictions.tomorrow = {
          date: formattedTomorrow,
          day_of_week: tomorrowWeekday,
          weekday_name: weekdayNames[tomorrowWeekday],
          predictions: null,
          message: "この曜日の履歴データがありません",
        };
      }
    } else {
      predictions.tomorrow = {
        date: null,
        day_of_week: null,
        weekday_name: null,
        predictions: null,
        message: "明日は土日のため営業していません",
      };
    }

    return NextResponse.json(
      {
        success: true,
        timestamp: new Date().toISOString(),
        data: predictions,
        message: "機械学習モデルによる予測",
      },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("今日明日予測エラー:", error);
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
