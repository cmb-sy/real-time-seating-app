"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Calendar, TrendingUp, Users, Activity } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from "recharts";
import { HeaderNav } from "@/components/ui/header-nav";
import { getApiConfig, checkApiAvailability } from "@/lib/api-config";

interface TodayTomorrowPrediction {
  date: string;
  day_of_week: string;
  density_rate: number;
  occupied_seats: number;
}

interface WeeklyAverageItem {
  weekday: number;
  weekday_name: string;
  density_rate: number;
  occupied_seats: number;
}

interface WeeklyAverageResponse {
  success: boolean;
  data: {
    weekly_averages: WeeklyAverageItem[];
  };
  error?: string;
  details?: string;
}

// AnalyticsPageコンポーネントをクライアントサイドでのみレンダリング - パフォーマンス最適化
function AnalyticsPageComponent() {
  const [todayPrediction, setTodayPrediction] =
    useState<TodayTomorrowPrediction | null>(null);
  const [tomorrowPrediction, setTomorrowPrediction] =
    useState<TodayTomorrowPrediction | null>(null);
  const [weeklyAverages, setWeeklyAverages] = useState<WeeklyAverageItem[]>([]);
  const [apiStatus, setApiStatus] = useState<string>("接続中");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLocalApi, setIsLocalApi] = useState<boolean>(false);
  const [currentBaseUrl, setCurrentBaseUrl] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // クライアントサイドマウント確認
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 今日と明日の日付情報を取得する関数
  const getTodayTomorrowInfo = () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const todayDate = today.toLocaleDateString("ja-JP", {
      month: "long",
      day: "numeric",
    });
    const tomorrowDate = tomorrow.toLocaleDateString("ja-JP", {
      month: "long",
      day: "numeric",
    });

    return { todayDate, tomorrowDate };
  };

  // API接続確認とエンドポイント決定
  const initializeApiConnection = async () => {
    console.log("API接続の初期化を開始...");

    try {
      const availability = await checkApiAvailability();

      setIsLocalApi(availability.isLocal);
      setCurrentBaseUrl(availability.baseUrl);

      if (availability.activeEndpoint === "local") {
        setApiStatus("ローカル接続");
        console.log("✅ ローカルバックエンドに接続しました");
        setIsConnected(true);
      } else if (availability.activeEndpoint === "production") {
        setApiStatus("本番ML接続");
        console.log("✅ 本番MLサーバーに接続しました");
        setIsConnected(true);
      } else if (availability.activeEndpoint === "same-origin") {
        setApiStatus("本番接続");
        console.log("✅ 同一ドメインAPIに接続しました");
        setIsConnected(true);
      } else {
        setApiStatus("接続失敗");
        console.log("❌ どちらのAPIサーバーも利用できません");
        setIsConnected(false);
      }

      return availability.baseUrl;
    } catch (error) {
      console.error("❌ API接続の初期化に失敗:", error);
      setApiStatus("接続失敗");
      setIsConnected(false);
      throw error;
    }
  };

  // 安全なフェッチ関数
  const safeFetch = async (url: string, timeout: number = 15000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  // 今日・明日の予測データを週間予測APIから取得
  const fetchTodayTomorrowPredictions = async (baseUrl: string | null) => {
    try {
      // baseUrlが空文字またはnullの場合は相対パスを使用
      const url = baseUrl
        ? `${baseUrl}/api/predictions/weekly`
        : "/api/predictions/weekly";
      console.log(`📅 週間予測データから今日・明日を取得中: ${url}`);

      const response = await safeFetch(url, 15000);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`📅 週間予測APIレスポンス:`, data);

      if (data.success && data.data) {
        // 今日と明日の曜日番号を計算（JavaScript標準: 0=日曜日, 1=月曜日...）
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const todayWeekday = today.getDay();
        const tomorrowWeekday = tomorrow.getDay();

        // 週間データから今日と明日を抽出
        let todayData = null;
        let tomorrowData = null;

        // 週間予測データを取得（平日のみ）
        const weeklyData = data.data.weekly_predictions || [];
        const weekdayData = weeklyData.filter(
          (dayData: any) => dayData.weekday >= 1 && dayData.weekday <= 5 // 月曜日〜金曜日のみ
        );

        weekdayData.forEach((dayData: any) => {
          if (dayData.weekday === todayWeekday) {
            todayData = {
              date: today.toISOString().split("T")[0],
              day_of_week: dayData.weekday_name,
              density_rate: dayData.density_rate,
              occupied_seats: dayData.occupied_seats,
            };
          } else if (dayData.weekday === tomorrowWeekday) {
            tomorrowData = {
              date: tomorrow.toISOString().split("T")[0],
              day_of_week: dayData.weekday_name,
              density_rate: dayData.density_rate,
              occupied_seats: dayData.occupied_seats,
            };
          }
        });

        setTodayPrediction(todayData);
        setTomorrowPrediction(tomorrowData);
        console.log(`✅ 今日・明日の予測データを取得しました`);
        setErrorDetails(null);
      } else {
        console.error("週間予測データの取得失敗:", data.error);
        setTodayPrediction(null);
        setTomorrowPrediction(null);
        setErrorDetails(data.details || data.error || null);
      }
    } catch (error) {
      console.error(`週間予測データ取得エラー:`, error);
      setTodayPrediction(null);
      setTomorrowPrediction(null);
      throw error;
    }
  };

  // 週間平均データを取得
  const fetchWeeklyAverages = async (baseUrl: string | null) => {
    try {
      // baseUrlが空文字またはnullの場合は相対パスを使用
      const url = baseUrl
        ? `${baseUrl}/api/predictions/weekly-averages`
        : "/api/predictions/weekly-averages";
      console.log(`📊 週間平均データを取得中: ${url}`);

      const response = await safeFetch(url, 15000);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: WeeklyAverageResponse = await response.json();
      console.log(`📊 週間平均のAPIレスポンス:`, data);

      if (data.success && data.data) {
        // MLサーバーからの実データを使用（平日のみ表示）
        const weeklyAverages = data.data.weekly_averages || [];
        // 平日のみフィルタリング（月曜日〜金曜日）
        const weekdayAverages = weeklyAverages.filter(
          (item: any) => item.weekday >= 1 && item.weekday <= 5
        );
        const sortedAverages = weekdayAverages.sort(
          (a, b) => a.weekday - b.weekday
        );
        setWeeklyAverages(sortedAverages);
        console.log(
          `✅ 週間平均データを取得しました（平日${sortedAverages.length}日分）`
        );
        setErrorDetails(null);
      } else {
        console.error("週間平均データの取得失敗:", data.error);
        setWeeklyAverages([]);
        setErrorDetails(data.details || data.error || null);
      }
    } catch (error) {
      console.error(`週間平均データ取得エラー:`, error);
      setWeeklyAverages([]);
      throw error;
    }
  };

  // 全データを取得する統合関数 - エラーハンドリング強化
  const fetchAllData = async () => {
    setIsLoading(true);

    try {
      const baseUrl = await initializeApiConnection();

      if (baseUrl === null) {
        console.warn(
          "⚠️ 利用可能なAPIサーバーがありません - 統計機能は利用できません"
        );
        setApiStatus("接続失敗");
        setIsConnected(false);
        return; // 処理を停止してループを防ぐ
      }

      // 並列でデータを取得（タイムアウト付き）
      await Promise.race([
        Promise.all([
          fetchTodayTomorrowPredictions(baseUrl!),
          fetchWeeklyAverages(baseUrl!),
        ]),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("タイムアウト")), 10000)
        ),
      ]);

      setLastUpdated(new Date());
    } catch (error) {
      console.error("データ取得処理でエラーが発生しました:", error);
      setApiStatus("エラー");
      setIsConnected(false);
      // エラー時は無限ループを防ぐために処理を停止
    } finally {
      setIsLoading(false);
    }
  };

  // 静的データのため手動更新機能は削除

  // 初期化設定 - 静的データのため1回のみ読み込み
  useEffect(() => {
    fetchAllData();
    // 静的JSONデータのため、定期更新は不要
  }, []);

  // グラフ用データ整形
  const chartData = weeklyAverages
    .sort((a, b) => a.weekday - b.weekday)
    .map((item) => ({
      day: item.weekday_name.replace("曜日", "曜"),
      weekday: item.weekday,
      occupancy_rate: item.density_rate, // density_rateを使用（既にパーセント値）
      occupied_seats: item.occupied_seats,
    }));

  // サーバーサイドレンダリング時は何も表示しない
  if (!isMounted) {
    return null;
  }

  // APIエラー時の表示
  if (apiStatus === "エラー" || apiStatus === "接続失敗") {
    return (
      <>
        <HeaderNav
          apiStatus={{
            isConnected: false,
            isLocal: isLocalApi,
            toggleEndpoint: () => {}, // 静的データのため更新機能は無効
          }}
        />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-6 p-8 rounded-2xl bg-white shadow-xl border border-gray-200 max-w-lg">
            <h1 className="text-4xl font-bold text-gray-800">
              メンテナンス中🙇
            </h1>
            <p className="text-gray-600">しばらくお待ちください。</p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 hover:bg-gray-100"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                座席画面に戻る
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const { todayDate, tomorrowDate } = getTodayTomorrowInfo();

  return (
    <>
      <HeaderNav
        apiStatus={{
          isConnected,
          isLocal: isLocalApi,
          toggleEndpoint: () => {}, // 静的データのため更新機能は無効
        }}
      />
      {/* ローディング表示 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-lg">データを取得中...</span>
            </div>
          </div>
        </div>
      )}
      {/* メインコンテンツ */}
      <div className="pt-8 pb-12 scrollable-page">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ページタイトル */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              統計分析ダッシュボード
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              勾配ブースティングモデルで予測しAPI経由で提供しています。隔週でモデルを更新し予測結果を更新してます。
            </p>
          </div>

          {/* 今日・明日の予測カード */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-gray-900">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-black" />
                  </div>
                  本日の予測
                </CardTitle>
                <p className="text-sm text-gray-400">
                  {todayDate} ({todayPrediction?.day_of_week || "データなし"})
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-2">占有席数</div>
                    <div className="text-5xl font-bold text-black">
                      {todayPrediction?.occupied_seats ?? "-"}
                      <span className="text-xl text-gray-400">席</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-2">
                      社内人口密度率
                    </div>
                    <div className="text-5xl font-bold text-black">
                      {todayPrediction?.density_rate !== undefined
                        ? todayPrediction.density_rate.toFixed(1)
                        : "-"}
                      <span className="text-xl text-gray-400">%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-gray-900">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-black" />
                  </div>
                  明日の予測
                </CardTitle>
                <p className="text-sm text-gray-400">
                  {tomorrowDate} (
                  {tomorrowPrediction?.day_of_week || "データなし"})
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-2">占有席数</div>
                    <div className="text-5xl font-bold text-black">
                      {tomorrowPrediction?.occupied_seats ?? "-"}
                      <span className="text-xl text-gray-400">席</span>
                    </div>
                    {!tomorrowPrediction && (
                      <div className="text-xs text-gray-400 mt-1">
                        データなし
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-2">
                      社内人口密度率
                    </div>
                    <div className="text-5xl font-bold text-black">
                      {tomorrowPrediction?.density_rate !== undefined
                        ? tomorrowPrediction.density_rate.toFixed(1)
                        : "-"}
                      <span className="text-xl text-gray-400">%</span>
                    </div>
                    {!tomorrowPrediction && (
                      <div className="text-xs text-gray-400 mt-1">
                        データなし
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 週間平均グラフ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 座席数グラフ */}
            <Card className="bg-white shadow-lg border border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-gray-900">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                  占有席数の週間平均
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {chartData.length > 0 ? (
                  <div style={{ width: "100%", height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="day"
                          tick={{ fontSize: 12, fill: "#374151" }}
                          interval={0}
                          axisLine={true}
                          tickLine={true}
                          height={60}
                        />
                        <YAxis domain={[0, 8]} allowDecimals={false} />
                        <Bar
                          dataKey="occupied_seats"
                          barSize={40}
                          fill="#8cbcff"
                        >
                          <LabelList
                            dataKey="occupied_seats"
                            position="top"
                            formatter={(val: number) => `${val}`}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="text-gray-400 mb-2">📊</div>
                      <p className="text-gray-500">データを読み込み中...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 人口密度率グラフ */}
            <Card className="bg-white shadow-lg border border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-gray-900">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  人口密度率の週間平均
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {chartData.length > 0 ? (
                  <div style={{ width: "100%", height: 400 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="day"
                          tick={{ fontSize: 12, fill: "#374151" }}
                          interval={0}
                          axisLine={true}
                          tickLine={true}
                          height={60}
                        />
                        <YAxis domain={[0, 100]} allowDecimals={false} />
                        <Bar
                          dataKey="occupancy_rate"
                          barSize={40}
                          fill="#86efac"
                        >
                          <LabelList
                            dataKey="occupancy_rate"
                            position="top"
                            formatter={(val: number) => `${val.toFixed(1)}%`}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                      <div className="text-gray-400 mb-2">📊</div>
                      <p className="text-gray-500">データを読み込み中...</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

export default dynamic(() => Promise.resolve(AnalyticsPageComponent), {
  ssr: false,
});
