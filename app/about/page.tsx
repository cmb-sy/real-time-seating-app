"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Monitor,
  Users,
  Clock,
  CheckCircle,
  BarChart3,
  Database,
  TrendingUp,
} from "lucide-react";

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

              <div className="flex items-start gap-4">
                <BarChart3 className="h-6 w-6 text-teal-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    人口密度率の測定
                  </h3>
                  <p className="text-gray-600">
                    社内の人口密度率をリアルタイムで計測し、オフィスの混雑状況を数値化して把握できます。
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

              <div className="flex items-start gap-4">
                <TrendingUp className="h-6 w-6 text-indigo-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    予測・統計分析
                  </h3>
                  <p className="text-gray-600">
                    収集されたデータを基に混雑予測や使用傾向の分析を行い、より効果的なオフィス運用をサポートします。
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

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Database className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-bold text-purple-800">
                データ連携・分析システム
              </h2>
            </div>
            <div className="space-y-4 text-gray-700">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    17:00 自動データ連携
                  </h3>
                  <p className="text-sm">
                    毎日17:00に座席の更新情報と社内人口密度率をデータベースに自動連携します。この定期的なデータ収集により、継続的な分析が可能になります。
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    予測・統計分析
                  </h3>
                  <p className="text-sm">
                    収集されたデータは高度な統計分析に活用され、混雑パターンの予測や最適な座席配置の提案に役立てられます。
                  </p>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border-l-4 border-purple-400 mt-4">
                <h4 className="font-semibold text-purple-800 mb-2">
                  活用データ
                </h4>
                <ul className="text-sm space-y-1 text-gray-600">
                  <li>• 座席使用状況の時系列データ</li>
                  <li>• 社内人口密度率の変動パターン</li>
                  <li>• 曜日・時間帯別の利用傾向</li>
                  <li>• 空席予測アルゴリズムの学習データ</li>
                </ul>
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
