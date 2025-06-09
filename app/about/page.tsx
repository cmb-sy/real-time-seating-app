"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Monitor, Users, Clock, CheckCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>戻る</span>
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <h1 className="text-4xl font-bold mb-8 text-gray-800 text-center">
            リアルタイム座席管理システム
          </h1>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Monitor className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    リアルタイム席監視
                  </h3>
                  <p className="text-gray-600">
                    オフィスの座席状況をリアルタイムで監視し、どの席が使用中で、どの席が空いているかを一目で確認できます。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    空席確認
                  </h3>
                  <p className="text-gray-600">
                    出社前や席を探している時に、空いている席を事前に確認できるため、効率的に作業場所を見つけることができます。
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Users className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    座席不足の解消
                  </h3>
                  <p className="text-gray-600">
                    出社しても席がない問題を解決。事前に座席状況を把握することで、安心して出社することができます。
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="h-6 w-6 text-orange-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    時間の無駄を削減
                  </h3>
                  <p className="text-gray-600">
                    席探しに費やす時間を削減し、より生産的な業務に集中できる環境を提供します。
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4 text-blue-800">
              システムについて
            </h2>
            <div className="space-y-3 text-gray-700">
              <p>
                このシステムは、オフィスの座席管理を効率化し、従業員の働きやすさを向上させることを目的として開発されました。
              </p>
              <p>
                リアルタイムで座席の使用状況を把握し、空席を素早く見つけることで、出社時の不安やストレスを軽減します。
              </p>
              <div className="bg-white p-4 rounded border-l-4 border-blue-400 mt-4">
                <p className="text-sm text-gray-600">
                  <strong>注意:</strong>{" "}
                  システムデータは毎日21:00にリセットされます。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            今後の実装予定
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-700">
                  混雑具合と社内人口密度率の予測機能
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">完全レスポンシブ対応</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-700">座席予約機能</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-gray-700">使用統計とレポート機能</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              ご要望やフィードバックがございましたら、開発チームまでお知らせください。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
