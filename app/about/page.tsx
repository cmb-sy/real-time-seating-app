"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
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
                座席ミエール
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
                このページは、デザインや一部の文言に生成AIを使っています。
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
                  🚀 リアルタイム監視
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
                  📊 使用傾向がわかる
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-full px-6 py-2 text-sm font-medium">
                  ⚡ 自動でデータ保存
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
                主な機能
              </h2>
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
                        今の席の状況がわかる
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        今使われている席と空いている席が一目でわかります。わざわざオフィスを歩き回って席を探す必要がありません。
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
                        出社前に空席確認
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        家にいる時や通勤中に、オフィスの席の空き状況を確認できます。席があるかわからずに出社する不安がなくなります。
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
                        オフィスの混雑状況
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        今オフィスにどのくらい人がいるかがわかります。混雑している時間帯や空いている時間帯が把握できます。
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
                        データは自動で保存
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        席の情報と人数の情報が更新されたら、夕方5時に自動でデータベースに保存されます。2週間ごとにデータを見直して、予測の精度を上げています。
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
                        席がない問題を解決
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        出社したのに座る席がない...そんな困った状況を防げます。事前に席の状況がわかるので、安心して出社できます。
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
                        席探しの時間を短縮
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        席を探してウロウロする時間がなくなります。その分、仕事に集中できる時間が増えます。
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
                        要望・お問い合わせ
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        使ってみて気づいたことや改善してほしい点があれば、お気軽にお知らせください。できる範囲で対応していきます。
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
                        使用パターンの分析
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        蓄積されたデータから、いつ頃混雑するかや席の使われ方の傾向を分析して、より使いやすいオフィスづくりに活用しています。
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
                <h2 className="text-4xl font-bold text-gray-900">利用者の声</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* ユーザーの声1 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-blue-200">
                  <Quote className="h-12 w-12" />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="font-bold text-gray-900 text-lg">
                      諸刃の剣
                    </h3>
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
                      プルダウンだと候補がでる。だからこそ、候補を出してほしいということですね。時間あればやります。
                    </p>
                  </div>
                </div>
              </div>

              {/* ユーザーの声2 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-blue-200">
                  <Quote className="h-12 w-12" />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="font-bold text-gray-900 text-lg">
                      モロッコ共和国
                    </h3>
                  </div>
                  <blockquote className="text-gray-700 text-lg leading-relaxed mb-4">
                    「会社で起きたちょっとおもろかったことをTwitterみたいにかけるスペースがホーム画面にほしい」
                  </blockquote>
                  <div className="bg-blue-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">
                        開発チームより
                      </span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      検討に検討を重ね、検討を加速させていきます。
                    </p>
                  </div>
                </div>
              </div>
              {/* ユーザーの声3 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-blue-200">
                  <Quote className="h-12 w-12" />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="font-bold text-gray-900 text-lg">
                      梅酒相対性理論
                    </h3>
                  </div>
                  <blockquote className="text-gray-700 text-lg leading-relaxed mb-4">
                    座席ごとの埋まっている確率があっても嬉しいかもと思いました。（この席は暗黙的に固定されているねーってことが分かりそう）
                  </blockquote>
                  <div className="bg-blue-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">
                        開発チームより
                      </span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      やれるときにやります。
                    </p>
                  </div>
                </div>
              </div>
              {/* ユーザーの声4 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 relative overflow-hidden">
                <div className="absolute top-4 right-4 text-blue-200">
                  <Quote className="h-12 w-12" />
                </div>
                <div className="relative">
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="font-bold text-gray-900 text-lg">
                      沖縄そばは飲み物
                    </h3>
                  </div>
                  <blockquote className="text-gray-700 text-lg leading-relaxed mb-4">
                    バーチャルオフィス感もあって良いなと思いました。プルダウンで人を選択できるようになった先には、アバターみたいなものが座ると、よりバーチャルオフィス感が強まりそうです。
                  </blockquote>
                  <div className="bg-blue-100 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">
                        開発チームより
                      </span>
                    </div>
                    <p className="text-blue-700 text-sm">わかりやした。</p>
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
                  <h2 className="text-4xl font-bold">データの管理と分析</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-3">
                      <Clock className="h-6 w-6" />
                      夕方5時に自動保存
                    </h3>
                    <p className="text-white/90 leading-relaxed">
                      席の情報と人数の情報が両方とも更新されていたら、夕方5時にデータベースに自動で保存します。必要な時だけ保存するので、効率的にデータを管理できます。
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <h3 className="font-bold text-xl mb-4 flex items-center gap-3">
                      <TrendingUp className="h-6 w-6" />
                      使用パターンの分析
                    </h3>
                    <p className="text-white/90 leading-relaxed">
                      集めたデータから、いつ頃混雑するかや席の使われ方の傾向を分析して、オフィスの使い方を改善するヒントを見つけています。
                    </p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border-l-4 border-white/50">
                  <h4 className="font-bold text-xl mb-4">分析に使うデータ</h4>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/90">
                        時間ごとの席の使用状況
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/90">
                        オフィスの人数の変化
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/90">
                        曜日・時間帯ごとの使われ方
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                      <span className="text-white/90">
                        空席予測のためのデータ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 感謝メッセージセクション */}
          <div className="mb-20">
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-3xl p-12 shadow-lg border border-amber-100 relative overflow-hidden">
              <div className="absolute top-4 right-4 opacity-10">
                <Heart className="h-32 w-32 text-amber-500" />
              </div>
              <div className="relative">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-amber-800 mb-4">
                    いつもありがとうございます
                  </h2>
                  <p className="text-xl text-amber-700 max-w-3xl mx-auto">
                    忙しい中、席の情報を入力していただき本当にありがとうございます。
                    <br />
                    皆さんのおかげで、みんなが使いやすいオフィスに近づいています。
                  </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 max-w-3xl mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-full p-2">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-xl text-amber-800">
                      データ入力で未来が変わります
                    </h3>
                  </div>
                  <p className="text-amber-700 leading-relaxed">
                    毎日の席の情報入力は、ただの記録じゃありません。このデータを分析することで、
                    混雑予測の精度を上げることができるのです。
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* フィードバック促進セクション */}
          <div className="bg-white rounded-3xl p-12 shadow-xl border border-gray-100">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                感想や要望をお聞かせください
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                使ってみての感想や「こうだったらいいな」という要望があれば、ぜひ教えてください。
                <br />
                時間があるときに、できる範囲で対応させていただきます。
              </p>
              <Link href="/contact">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
                  フィードバックを送る
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
