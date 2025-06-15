"use client";

import React, { useState, useEffect } from "react";
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

// API設定
const API_ENDPOINTS = {
  LOCAL: {
    TODAY_TOMORROW: "http://localhost:8000/api/predictions/today-tomorrow",
    WEEKLY_AVERAGE: "http://localhost:8000/api/predictions/weekly-average",
  },
  PRODUCTION: {
    TODAY_TOMORROW: "/api/predictions/today-tomorrow",
    WEEKLY_AVERAGE: "/api/predictions/weekly-average",
  },
};

interface TodayTomorrowPrediction {
  date: string;
  day_of_week: string;
  occupancy_rate: number;
  occupied_seats: number;
}

interface TodayTomorrowResponse {
  success: boolean;
  data: {
    today: TodayTomorrowPrediction;
    tomorrow: TodayTomorrowPrediction;
  };
  error?: string;
}

interface WeeklyAverageItem {
  weekday: number;
  weekday_name: string;
  occupancy_rate: number;
  occupied_seats: number;
}

interface WeeklyAverageResponse {
  success: boolean;
  data: {
    weekly_averages: WeeklyAverageItem[];
  };
  error?: string;
}

export default function AnalyticsPage() {
  const [todayPrediction, setTodayPrediction] =
    useState<TodayTomorrowPrediction | null>(null);
  const [tomorrowPrediction, setTomorrowPrediction] =
    useState<TodayTomorrowPrediction | null>(null);
  const [weeklyAverages, setWeeklyAverages] = useState<WeeklyAverageItem[]>([]);
  const [apiStatus, setApiStatus] = useState<string>("接続中");
  const [currentEndpoint, setCurrentEndpoint] = useState<
    "LOCAL" | "PRODUCTION"
  >("LOCAL");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLocalApi, setIsLocalApi] = useState<boolean>(true);

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

    // 曜日名を日本語で取得
    const getJapaneseWeekday = (date: Date) => {
      const weekdays = ["月曜日", "火曜日", "水曜日", "木曜日", "金曜日"];
      return weekdays[date.getDay()];
    };

    return {
      todayDate,
      tomorrowDate,
      todayWeekday: getJapaneseWeekday(today),
      tomorrowWeekday: getJapaneseWeekday(tomorrow),
    };
  };

  // API接続テスト＆エンドポイント決定
  const determineApiEndpoint = async (): Promise<"LOCAL" | "PRODUCTION"> => {
    console.log("APIエンドポイントの決定を開始...");

    try {
      // まずローカルAPIを試行
      console.log("ローカルAPIを試行中:", API_ENDPOINTS.LOCAL.TODAY_TOMORROW);
      const localResponse = await fetch(API_ENDPOINTS.LOCAL.TODAY_TOMORROW, {
        method: "HEAD", // HEADメソッドで軽量チェック
        signal: AbortSignal.timeout(3000), // 3秒でタイムアウト
      });

      if (localResponse.ok) {
        console.log("✅ ローカルAPIサーバーが利用可能です");
        setApiStatus("ローカル接続");
        setIsConnected(true);
        setIsLocalApi(true);
        return "LOCAL";
      } else {
        console.log(
          `❌ ローカルAPI応答エラー: ${localResponse.status} ${localResponse.statusText}`
        );
      }
    } catch (error) {
      console.log("❌ ローカルAPIサーバーが利用できません:", error);
    }

    try {
      // 本番APIを試行
      console.log("本番APIを試行中:", API_ENDPOINTS.PRODUCTION.TODAY_TOMORROW);
      const prodResponse = await fetch(
        API_ENDPOINTS.PRODUCTION.TODAY_TOMORROW,
        {
          method: "HEAD",
          signal: AbortSignal.timeout(5000), // 5秒でタイムアウト
        }
      );

      if (prodResponse.ok) {
        console.log("✅ 本番APIサーバーが利用可能です");
        setApiStatus("本番接続");
        setIsConnected(true);
        setIsLocalApi(false);
        return "PRODUCTION";
      } else {
        console.log(
          `❌ 本番API応答エラー: ${prodResponse.status} ${prodResponse.statusText}`
        );
      }
    } catch (error) {
      console.error("❌ 本番APIサーバーエラー:", error);
    }

    console.error("❌ すべてのAPIエンドポイントが利用できません");
    setApiStatus("接続失敗");
    setIsConnected(false);
    throw new Error("すべてのAPIエンドポイントが利用できません");
  };

  // 安全なフェッチ関数（エラーハンドリング強化）
  const safeFetch = async (url: string, options: RequestInit = {}) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 100000); // 10秒でタイムアウト

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  };

  // 今日・明日の予測データを取得（エンドポイント自動選択対応）
  const fetchTodayTomorrowPredictions = async (
    endpoint: "LOCAL" | "PRODUCTION"
  ) => {
    try {
      const url = API_ENDPOINTS[endpoint].TODAY_TOMORROW;
      const response = await safeFetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TodayTomorrowResponse = await response.json();
      console.log(`📅 今日・明日のAPIレスポンス (${endpoint}):`, data);

      if (data.success && data.data) {
        setTodayPrediction(data.data.today);
        setTomorrowPrediction(data.data.tomorrow);
        console.log(
          `✅ 今日・明日の予測データを${
            endpoint === "LOCAL" ? "ローカル" : "本番"
          }から取得しました:`,
          { today: data.data.today, tomorrow: data.data.tomorrow }
        );
      } else {
        console.error("今日・明日予測データの取得失敗:", data.error);
        setTodayPrediction(null);
        setTomorrowPrediction(null);
      }
    } catch (error) {
      console.error(`今日・明日予測データ取得エラー (${endpoint}):`, error);
      setTodayPrediction(null);
      setTomorrowPrediction(null);
      throw error; // エラーを上位に伝播
    }
  };

  // 週間平均データを取得（エンドポイント自動選択対応）
  const fetchWeeklyAverages = async (endpoint: "LOCAL" | "PRODUCTION") => {
    try {
      const url = API_ENDPOINTS[endpoint].WEEKLY_AVERAGE;
      const response = await safeFetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: WeeklyAverageResponse = await response.json();
      console.log(`📊 週間平均のAPIレスポンス (${endpoint}):`, data);

      if (data.success && data.data) {
        // 曜日順にソート（月曜=0から日曜=6）
        const sortedAverages = data.data.weekly_averages.sort(
          (a, b) => a.weekday - b.weekday
        );
        setWeeklyAverages(sortedAverages);
        console.log(
          `✅ 週間平均データを${
            endpoint === "LOCAL" ? "ローカル" : "本番"
          }から取得しました:`,
          sortedAverages
        );
      } else {
        console.error("週間平均データの取得失敗:", data.error);
        setWeeklyAverages([]);
      }
    } catch (error) {
      console.error(`週間平均データ取得エラー (${endpoint}):`, error);
      setWeeklyAverages([]);
      throw error; // エラーを上位に伝播
    }
  };

  // 全データを取得する統合関数（フォールバック機能付き）
  const fetchAllData = async () => {
    setIsLoading(true);

    try {
      // APIエンドポイントを決定
      const selectedEndpoint = await determineApiEndpoint();
      setCurrentEndpoint(selectedEndpoint);

      // 並列でデータを取得
      await Promise.all([
        fetchTodayTomorrowPredictions(selectedEndpoint),
        fetchWeeklyAverages(selectedEndpoint),
      ]);

      setLastUpdated(new Date());
    } catch (error) {
      console.error("データ取得処理でエラーが発生しました:", error);
      setApiStatus("エラー");
    } finally {
      setIsLoading(false);
    }
  };

  // 手動でエンドポイントを切り替える関数
  const switchEndpoint = async () => {
    const newEndpoint = currentEndpoint === "LOCAL" ? "PRODUCTION" : "LOCAL";
    setCurrentEndpoint(newEndpoint);
    setApiStatus("切り替え中");
    setIsLocalApi(newEndpoint === "LOCAL");

    try {
      await Promise.all([
        fetchTodayTomorrowPredictions(newEndpoint),
        fetchWeeklyAverages(newEndpoint),
      ]);
      setApiStatus(newEndpoint === "LOCAL" ? "ローカル接続" : "本番接続");
      setIsConnected(true);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("エンドポイント切り替えでエラー:", error);
      setApiStatus("エラー");
      setIsConnected(false);
    }
  };

  // 初期化とデータ更新の設定
  useEffect(() => {
    const initializeData = async () => {
      await fetchAllData();
    };

    initializeData();

    // 5分ごとにデータを更新
    const interval = setInterval(() => {
      fetchAllData();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  // グラフ用データ整形
  const chartData = weeklyAverages
    .sort((a, b) => a.weekday - b.weekday)
    .map((item) => ({
      day: item.weekday_name.replace("曜日", "曜"), // "月曜日" → "月曜"
      weekday: item.weekday,
      occupancy_rate: item.occupancy_rate * 100,
      occupied_seats: item.occupied_seats,
    }));

  // デバッグ用ログ
  console.log("📊 グラフデータ:", {
    weeklyAverages,
    chartData,
    todayPrediction,
    tomorrowPrediction,
    apiStatus,
    isConnected,
    isLoading,
    chartDataLength: chartData.length,
    hasWeeklyData: weeklyAverages.length > 0,
    hasTodayData: !!todayPrediction,
    hasTomorrowData: !!tomorrowPrediction,
  });

  // APIエラー時の表示
  if (apiStatus === "エラー" || apiStatus === "接続失敗") {
    return (
      <>
        <HeaderNav
          apiStatus={{
            isConnected: false,
            isLocal: isLocalApi,
            toggleEndpoint: switchEndpoint,
          }}
        />
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center space-y-6 p-8 rounded-2xl bg-white shadow-xl border border-gray-200">
            <h1 className="text-4xl font-bold text-gray-800">接続エラー🔌</h1>
            <p className="text-gray-600">
              ローカル・本番両方のAPIサーバーに接続できませんでした
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={fetchAllData}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
              >
                再接続を試行
              </Button>
              <Button
                onClick={() => (window.location.href = "/")}
                variant="outline"
                className="font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
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
          toggleEndpoint: switchEndpoint,
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
      <div className="pt-8 pb-12">
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
                  {todayDate} ({todayPrediction?.day_of_week || "-"})
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
                      {todayPrediction?.occupancy_rate !== undefined
                        ? (todayPrediction.occupancy_rate * 100).toFixed(1)
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
                  {tomorrowDate} ({tomorrowPrediction?.day_of_week || "-"})
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
                      {tomorrowPrediction?.occupancy_rate !== undefined
                        ? (tomorrowPrediction.occupancy_rate * 100).toFixed(1)
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
                  <div className="text-center py-16 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-3 animate-pulse" />
                    <p className="text-lg">
                      {isLoading
                        ? "データを分析中..."
                        : "週間データがありません"}
                    </p>
                    {!isLoading && (
                      <p className="text-sm mt-2">
                        API接続: {apiStatus} | データ件数: {chartData.length}
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 社内人口密度率グラフ */}
            <Card className="bg-white shadow-lg border border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-gray-900">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                  社内人口密度率の週間平均
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
                        <YAxis
                          unit="%"
                          domain={[0, 100]}
                          allowDecimals={false}
                        />
                        <Bar
                          dataKey="occupancy_rate"
                          barSize={40}
                          fill="#b3f7c1"
                        >
                          <LabelList
                            dataKey="occupancy_rate"
                            position="top"
                            formatter={(val: number) => `${val.toFixed(1)}`}
                          />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-16 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-3 animate-pulse" />
                    <p className="text-lg">
                      {isLoading
                        ? "データを分析中..."
                        : "週間データがありません"}
                    </p>
                    {!isLoading && (
                      <p className="text-sm mt-2">
                        API接続: {apiStatus} | データ件数: {chartData.length}
                      </p>
                    )}
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
