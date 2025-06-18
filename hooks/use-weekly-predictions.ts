import { useState, useEffect } from "react";

// 週間予測データの型定義
interface WeeklyPredictionData {
  date: string;
  weekday: number;
  weekday_name: string;
  is_weekend: boolean;
  occupancy_rate: number;
  occupied_seats: number;
}

interface WeeklyPredictionsResponse {
  success: boolean;
  data: {
    [key: string]: WeeklyPredictionData; // day0, day1, day2, ...
  };
  error?: string;
}

interface TodayTomorrowData {
  today: WeeklyPredictionData | null;
  tomorrow: WeeklyPredictionData | null;
}

/**
 * 週間予測データから今日と明日の情報を抽出するフック
 * APIから7日間のデータを取得し、JSONから曜日を取得して今日の曜日と比較
 */
export function useWeeklyPredictions() {
  const [data, setData] = useState<TodayTomorrowData>({
    today: null,
    tomorrow: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchWeeklyPredictions() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/predictions/weekly");
        const result: WeeklyPredictionsResponse = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.error || "週間予測データの取得に失敗しました");
        }

        // 今日の曜日を取得（0=月曜日, 1=火曜日, ..., 6=日曜日）
        const today = new Date();
        const currentWeekday = (today.getDay() + 6) % 7; // JavaScript: 0=日曜 → API: 0=月曜に変換

        // 明日の曜日を計算
        const tomorrowWeekday = (currentWeekday + 1) % 7;

        // 今日の日付（YYYY-MM-DD形式）
        const todayDateString = today.toISOString().split("T")[0];

        // 明日の日付
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        const tomorrowDateString = tomorrow.toISOString().split("T")[0];

        // 7日間のデータから今日と明日を探す
        let todayData: WeeklyPredictionData | null = null;
        let tomorrowData: WeeklyPredictionData | null = null;

        // APIレスポンスのdataオブジェクトを検索
        Object.values(result.data).forEach((dayData) => {
          // 日付で比較
          if (dayData.date === todayDateString) {
            todayData = dayData;
          } else if (dayData.date === tomorrowDateString) {
            tomorrowData = dayData;
          }
        });

        // 日付での検索で見つからない場合は、曜日で検索（フォールバック）
        if (!todayData || !tomorrowData) {
          Object.values(result.data).forEach((dayData) => {
            if (!todayData && dayData.weekday === currentWeekday) {
              todayData = dayData;
            }
            if (!tomorrowData && dayData.weekday === tomorrowWeekday) {
              tomorrowData = dayData;
            }
          });
        }

        setData({
          today: todayData,
          tomorrow: tomorrowData,
        });
      } catch (err) {
        console.error("週間予測データの取得エラー:", err);
        setError(
          err instanceof Error ? err.message : "不明なエラーが発生しました"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchWeeklyPredictions();
  }, []);

  return { data, loading, error };
}
