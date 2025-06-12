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

// FastAPI レスポンスデータ型定義（実際のAPI仕様に基づく）
interface PredictionResponse {
  success: boolean;
  day_of_week: number;
  weekday_name: string;
  predictions: {
    density_rate: number;
    occupied_seats: number;
  };
  message: string;
}

interface WeekdayAnalysisItem {
  レコード数: number;
  density_rate: {
    平均: number;
    中央値: number;
    標準偏差: number;
    最小: number;
    最大: number;
  };
  occupied_seats: {
    平均: number;
    中央値: number;
    標準偏差: number;
    最小: number;
    最大: number;
  };
}

interface WeekdayAnalysisResponse {
  success: boolean;
  data: {
    detailed_stats: {
      [key: string]: WeekdayAnalysisItem;
    };
    summary: {
      [key: string]: {
        density_rate_mean: number;
        density_rate_std: number;
        occupied_seats_mean: number;
        occupied_seats_std: number;
        record_count: number;
      };
    };
  };
  message: string;
}

export default function AnalyticsPage() {
  const [todayPrediction, setTodayPrediction] =
    useState<PredictionResponse | null>(null);
  const [tomorrowPrediction, setTomorrowPrediction] =
    useState<PredictionResponse | null>(null);
  const [weekdayAnalysis, setWeekdayAnalysis] =
    useState<WeekdayAnalysisResponse | null>(null);
  const [apiStatus, setApiStatus] = useState<string>("正常");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getTodayTomorrowDayIndex = () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const toJS = (d: Date) => (d.getDay() === 0 ? 6 : d.getDay() - 1);
    const todayAPIIndex = toJS(today);
    const tomorrowAPIIndex = toJS(tomorrow);

    const todayDate = today.toLocaleDateString("ja-JP", {
      month: "long",
      day: "numeric",
    });
    const tomorrowDate = tomorrow.toLocaleDateString("ja-JP", {
      month: "long",
      day: "numeric",
    });

    return { todayAPIIndex, tomorrowAPIIndex, todayDate, tomorrowDate };
  };

  const testApiConnection = async () => {
    try {
      // 同じドメインのAPIエンドポイントを使用
      const response = await fetch(`/api/health`);
      if (response.ok) {
        setApiStatus("正常");
        return true;
      } else {
        setApiStatus("エラー");
        return false;
      }
    } catch (error) {
      console.error("API接続エラー:", error);
      setApiStatus("切断");
      return false;
    }
  };

  const fetchTodayTomorrowPredictions = async (): Promise<{
    today: PredictionResponse | null;
    tomorrow: PredictionResponse | null;
  }> => {
    try {
      // 今日と明日の予測データを一度に取得
      const response = await fetch(`/api/predictions/today-tomorrow`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        const today = data.data.today?.predictions
          ? {
              success: true,
              day_of_week: data.data.today.day_of_week,
              weekday_name: data.data.today.weekday_name,
              predictions: data.data.today.predictions,
              message: data.message,
            }
          : null;

        const tomorrow = data.data.tomorrow?.predictions
          ? {
              success: true,
              day_of_week: data.data.tomorrow.day_of_week,
              weekday_name: data.data.tomorrow.weekday_name,
              predictions: data.data.tomorrow.predictions,
              message: data.message,
            }
          : null;

        return { today, tomorrow };
      }

      return { today: null, tomorrow: null };
    } catch (error) {
      console.error("予測データ取得エラー:", error);
      return { today: null, tomorrow: null };
    }
  };

  const fetchWeekdayAnalysis = async () => {
    try {
      // 週平均の予測データを取得
      const response = await fetch(`/api/predictions/weekly-average`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.data) {
        // APIレスポンスを既存の形式に変換
        const transformedData: WeekdayAnalysisResponse = {
          success: true,
          data: {
            detailed_stats: {},
            summary: {},
          },
          message: data.message,
        };

        // 日別予測データを変換
        Object.entries(data.data.daily_predictions).forEach(
          ([day, prediction]: [string, any]) => {
            transformedData.data.detailed_stats[day] = {
              レコード数: 1,
              density_rate: {
                平均: prediction.predictions.density_rate,
                中央値: prediction.predictions.density_rate,
                標準偏差: 0,
                最小: prediction.predictions.density_rate,
                最大: prediction.predictions.density_rate,
              },
              occupied_seats: {
                平均: prediction.predictions.occupied_seats,
                中央値: prediction.predictions.occupied_seats,
                標準偏差: 0,
                最小: prediction.predictions.occupied_seats,
                最大: prediction.predictions.occupied_seats,
              },
            };
          }
        );

        setWeekdayAnalysis(transformedData);
      } else {
        setWeekdayAnalysis(null);
      }
    } catch (error) {
      console.error("曜日別分析データ取得エラー:", error);
      setWeekdayAnalysis(null);
    }
  };

  const fetchAllData = async () => {
    setIsLoading(true);

    const isConnected = await testApiConnection();
    if (!isConnected) {
      setIsLoading(false);
      return;
    }

    const { today, tomorrow } = await fetchTodayTomorrowPredictions();

    setTodayPrediction(today);
    setTomorrowPrediction(tomorrow);

    await fetchWeekdayAnalysis();
    setLastUpdated(new Date());
    setIsLoading(false);
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchAllData();
    };

    initializeData();

    const interval = setInterval(() => {
      fetchAllData();
    }, 300000);

    return () => clearInterval(interval);
  }, []);

  const handleBackToSeats = () => {
    window.location.href = "/";
  };

  // グラフ用データ整形
  const chartData = weekdayAnalysis?.data
    ? Object.entries(weekdayAnalysis.data.detailed_stats).map(
        ([day, stat]) => ({
          day,
          density_rate: stat.density_rate.平均,
          occupied_seats: stat.occupied_seats.平均,
        })
      )
    : [];

  if (apiStatus !== "正常") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-6 p-8 rounded-2xl bg-white shadow-xl border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-800">メンテナンス中🙇</h1>
          <Button
            onClick={handleBackToSeats}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            座席画面に戻る
          </Button>
        </div>
      </div>
    );
  }

  const { todayDate, tomorrowDate } = getTodayTomorrowDayIndex();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ナビゲーションバー */}
      {/* ナビゲーションバー */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          {/* ── 左側: タイトルのみ */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-900">
              統計分析ダッシュボード（ベータ版）
            </h1>
            <p className="text-sm text-gray-400">
              決定木のアンサンブル学習を用いています。隔週でモデルを更新し予測結果を更新してます。
            </p>
          </div>

          {/* ── 右側: ローディング＆座席画面ボタン */}
          <div className="flex items-center gap-4">
            {isLoading && (
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <span className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></span>
                データ取得中...
              </div>
            )}
            <Button
              onClick={handleBackToSeats}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              座席画面
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* 今日・明日の予測（数値表示のみ） */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Calendar className="h-6 w-6 text-black" />
                </div>
                本日の予測
              </CardTitle>
              <p className="text-sm text-gray-400">
                {todayDate} ({todayPrediction?.weekday_name || "-"})
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">席占有率</div>
                  <div className="text-5xl font-bold text-black">
                    {todayPrediction?.predictions.occupied_seats || "-"}
                    <span className="text-xl text-gray-400">席</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">
                    社内人口密度率
                  </div>
                  <div className="text-5xl font-bold text-black">
                    {todayPrediction?.predictions.density_rate.toFixed(1) ||
                      "-"}
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
                {tomorrowDate} ({tomorrowPrediction?.weekday_name || "-"})
              </p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">席占有率</div>
                  <div className="text-5xl font-bold text-black">
                    {tomorrowPrediction?.predictions.occupied_seats || "-"}
                    <span className="text-xl text-gray-400">席</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">
                    社内人口密度率
                  </div>
                  <div className="text-5xl font-bold text-black">
                    {tomorrowPrediction?.predictions.density_rate.toFixed(1) ||
                      "-"}
                    <span className="text-xl text-gray-400">%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 棒グラフ表示部分 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 占有率グラフ */}
          <Card className="bg-white shadow-lg border border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                席占有数の平均値
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {chartData.length > 0 ? (
                <div style={{ width: "100%", height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis domain={[0, 8]} allowDecimals={false} />
                      <Bar dataKey="occupied_seats" barSize={40} fill="#8cbcff">
                        {/* 棒の上に数値ラベルを表示 */}
                        <LabelList
                          dataKey="occupied_seats"
                          position="top"
                          formatter={(val: number) => `${val.toFixed(1)}`}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-16 text-gray-500">
                  <Activity className="h-12 w-12 mx-auto mb-3 animate-pulse" />
                  <p className="text-lg">データを分析中...</p>
                </div>
              )}
            </CardContent>
          </Card>
          {/* 密度率グラフ */}
          <Card className="bg-white shadow-lg border border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-gray-900">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                社内人口密度率の平均値
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {chartData.length > 0 ? (
                <div style={{ width: "100%", height: 400 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis unit="%" domain={[0, 100]} allowDecimals={false} />
                      <Bar dataKey="density_rate" barSize={40} fill="#b3f7c1">
                        {/* 棒の上に数値ラベルを表示 */}
                        <LabelList
                          dataKey="density_rate"
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
                  <p className="text-lg">データを分析中...</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
