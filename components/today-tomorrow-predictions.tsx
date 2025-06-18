"use client";

import { Calendar, Users, TrendingUp, Clock } from "lucide-react";
import { useWeeklyPredictions } from "@/hooks/use-weekly-predictions";

export function TodayTomorrowPredictions() {
  const { data, loading, error } = useWeeklyPredictions();

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-center space-y-4">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
          <span className="ml-3 text-gray-600">予測データを読み込み中...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-xl p-6 border border-red-200">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">!</span>
          </div>
          <div>
            <h3 className="font-semibold text-red-800">
              予測データの取得に失敗しました
            </h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  const { today, tomorrow } = data;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
        <TrendingUp className="h-6 w-6 text-blue-600" />
        座席占有率予測
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 今日の予測 */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-blue-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              今日
            </h3>
            {today && (
              <span className="text-sm text-blue-600 bg-white/70 px-3 py-1 rounded-full">
                {today.weekday_name}
              </span>
            )}
          </div>

          {today ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-700">日付</span>
                <span className="font-semibold text-blue-900">
                  {today.date}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-700">占有率</span>
                <span className="font-bold text-2xl text-blue-900">
                  {(today.occupancy_rate * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-700 flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  予想席数
                </span>
                <span className="font-semibold text-blue-900">
                  {today.occupied_seats}席
                </span>
              </div>
              {today.is_weekend && (
                <div className="mt-3 p-2 bg-orange-100 rounded-lg border border-orange-200">
                  <p className="text-orange-800 text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    土日のため、通常は0席の予想です
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-blue-600">
              <p>今日のデータが見つかりません</p>
            </div>
          )}
        </div>

        {/* 明日の予測 */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-green-800 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              明日
            </h3>
            {tomorrow && (
              <span className="text-sm text-green-600 bg-white/70 px-3 py-1 rounded-full">
                {tomorrow.weekday_name}
              </span>
            )}
          </div>

          {tomorrow ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-green-700">日付</span>
                <span className="font-semibold text-green-900">
                  {tomorrow.date}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-700">占有率</span>
                <span className="font-bold text-2xl text-green-900">
                  {(tomorrow.occupancy_rate * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-700 flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  予想席数
                </span>
                <span className="font-semibold text-green-900">
                  {tomorrow.occupied_seats}席
                </span>
              </div>
              {tomorrow.is_weekend && (
                <div className="mt-3 p-2 bg-orange-100 rounded-lg border border-orange-200">
                  <p className="text-orange-800 text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    土日のため、通常は0席の予想です
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-green-600">
              <p>明日のデータが見つかりません</p>
            </div>
          )}
        </div>
      </div>

      {/* 説明テキスト */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-2">📊 予測について</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 機械学習モデルによる占有率の予測データです</li>
          <li>• データは過去の実績をもとに算出されています</li>
          <li>
            • 土日は通常0席となりますが、実データがある場合はその平均値を表示
          </li>
          <li>• 予測の精度は密度率R²=0.937、座席数R²=0.661です</li>
        </ul>
      </div>
    </div>
  );
}
