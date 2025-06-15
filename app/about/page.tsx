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
  MessageSquare,
  Star,
  Quote,
  Lightbulb,
  Zap,
  Heart,
} from "lucide-react";
import { HeaderNav } from "@/components/ui/header-nav";

export default function AboutPage() {
  return (
    <>
      <HeaderNav />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* ヒーローセクション */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                リアルタイム座席管理システム
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                未来のオフィス体験を、今ここに。AIと統計分析で実現する、スマートな座席管理ソリューション
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
                  🚀 リアルタイム監視
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
                  📊 AI予測分析
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
                  ⚡ 自動データ連携
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* 主要機能セクション */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                革新的な機能
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                最新のテクノロジーを活用した、次世代の座席管理システム
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* 左側の機能 */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-start gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3">
                      <Monitor className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        リアルタイム席監視
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        オフィスの座席状況をリアルタイムで監視し、どの席が使用中で、どの席が空いているかを一目で確認できます。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-start gap-6">
                    <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3">
                      <CheckCircle className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        スマート空席確認
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        出社前や席を探している時に、空いている席を事前に確認できるため、効率的に作業場所を見つけることができます。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-start gap-6">
                    <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-3">
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        人口密度率の測定
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        社内の人口密度率をリアルタイムで計測し、オフィスの混雑状況を数値化して把握できます。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-start gap-6">
                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-3">
                      <Zap className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        自動化されたデータ収集
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        席情報と社内人口密度率の両方に更新があった場合、17:00にデータベースに自動連携する機能だけでなく、隔週で最新データを学習しモデルを更新します。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右側の機能 */}
              <div className="space-y-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-start gap-6">
                    <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-3">
                      <Users className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        座席不足の解消
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        出社しても席がない問題を解決。事前に座席状況を把握することで、安心して出社することができます。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-start gap-6">
                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-3">
                      <Clock className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        時間の無駄を削減
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        席探しに費やす時間を削減し、より生産的な業務に集中できる環境を提供します。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-start gap-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-3">
                      <MessageSquare className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        お問い合わせ機能
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        お問い合わせフォームを設置し、お客様からのご意見やご要望を受け付け、どんどん性能を向上させていきます。
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
                  <div className="flex items-start gap-6">
                    <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-3">
                      <TrendingUp className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        予測・統計分析
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        収集されたデータを基に混雑予測や使用傾向の分析を行い、より効果的なオフィス運用をサポートします。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ユーザーの声セクション */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="h-8 w-8 text-red-500" />
                <h2 className="text-4xl font-bold text-gray-900">
                  ユーザーの声
                </h2>
                <Heart className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                実際にご利用いただいているユーザー様からの貴重なフィードバック
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* ユーザーの声1 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-blue-200">
                  <Quote className="h-12 w-12" />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      諸
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        諸刃の剣をより頂いた
                      </h3>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 text-lg leading-relaxed mb-4">
                    「ちょっと慣れてきたらプルダウンにして席の入力をより早くしたい。てかもう候補を出してほしい。」
                  </blockquote>
                  <div className="bg-blue-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">
                        開発チームより
                      </span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      素晴らしいご提案ありがとうございます！プルダウン形式での席選択機能と、AIによる席候補の自動提案機能について、時間があるときに対応を検討させていただきます。
                    </p>
                  </div>
                </div>
              </div>

              {/* ユーザーの声2 */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-200 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-green-200">
                  <Quote className="h-12 w-12" />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      モ
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        モロッコ共和国
                      </h3>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <blockquote className="text-gray-700 text-lg leading-relaxed mb-4">
                    「会社で起きたちょっとおもろかったことをTwitterみたいにかけるスペースがホーム画面にほしい」
                  </blockquote>
                  <div className="bg-green-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-800">
                        開発チームより
                      </span>
                    </div>
                    <p className="text-green-700 text-sm">
                      とても面白いアイデアですね！社内コミュニケーション機能として、ホーム画面にTwitterライクな投稿スペースについて、時間があるときに対応を検討させていただきます。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* データ連携・分析システム */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-12 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-white/20 rounded-xl p-3">
                    <Database className="h-10 w-10 text-white" />
                  </div>
                  <h2 className="text-4xl font-bold">
                    データ連携・分析システム
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-3">
                      <Clock className="h-6 w-6" />
                      17:00 自動データ連携
                    </h3>
                    <p className="text-white/90 leading-relaxed">
                      座席の更新情報と社内人口密度率の両方に更新があった場合、17:00にデータベースに自動連携します。この条件付きデータ収集により、効率的で意味のある分析が可能になります。
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-3">
                      <TrendingUp className="h-6 w-6" />
                      予測・統計分析
                    </h3>
                    <p className="text-white/90 leading-relaxed">
                      収集されたデータは高度な統計分析に活用され、混雑パターンの予測や最適な座席配置の提案に役立てられます。
                    </p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-l-4 border-white/50">
                  <h4 className="font-bold text-xl mb-4">活用データ</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/90">
                        座席使用状況の時系列データ
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/90">
                        社内人口密度率の変動パターン
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/90">
                        曜日・時間帯別の利用傾向
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/90">
                        空席予測アルゴリズムの学習データ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* フィードバック促進セクション */}
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                あなたの声をお聞かせください
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                いただいたユーザーの声については、本当に時間があるときに対応させていただきます。
                <br />
                ご要望やフィードバックがございましたら、開発チームまでお気軽にお知らせください。
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                フィードバックを送る
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
