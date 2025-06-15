import { HeaderNav } from "@/components/ui/header-nav";
import { Heart, Sparkles, Users, Clock, Star, Gift } from "lucide-react";

export default function ThankYouPage() {
  return (
    <>
      <HeaderNav />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 relative overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-pink-200/30 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-blue-200/30 rounded-full blur-xl animate-pulse delay-2000"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-pink-200/30 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* メインヒーローセクション */}
          <div className="text-center mb-16">
            <div className="flex justify-center items-center gap-4 mb-8">
              <Sparkles className="h-12 w-12 text-yellow-500 animate-bounce" />
            </div>

            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              ありがとうございます
            </h1>

            <div className="flex justify-center items-center gap-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-8 w-8 fill-yellow-400 text-yellow-400 animate-pulse"
                  style={{ animationDelay: `${i * 200}ms` }}
                />
              ))}
            </div>

            <p className="text-2xl md:text-3xl text-gray-700 font-medium max-w-4xl mx-auto leading-relaxed">
              お忙しい中、貴重なお時間を割いていただき、
              <br />
              <span className="text-pink-600 font-bold">
                本当にありがとうございました
              </span>
            </p>
          </div>

          {/* 感謝のメッセージカード */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* 左側: 感謝のメッセージ */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-pink-200/50 to-purple-200/50 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-full p-3">
                    <Heart className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    心からの感謝
                  </h2>
                </div>

                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    正直なところ、座席情報の入力は
                    <span className="font-semibold text-purple-600">
                      面倒な作業
                    </span>
                    だと思います。
                  </p>
                  <p className="text-lg">
                    それでも、わざわざ手間をかけて、時間を取って、
                    <br />
                    <span className="font-bold text-pink-600 text-xl">
                      ご協力いただいたこと
                    </span>
                    を心から感謝いたします。
                  </p>
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-4 border-l-4 border-pink-400">
                    <p className="font-semibold text-pink-800">
                      🙏 申し訳ない気持ちと、感謝の気持ちでいっぱいです
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 右側: システムへの貢献 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-200/50 to-purple-200/50 rounded-full blur-2xl"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-full p-3">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    開発チームのために
                  </h2>
                </div>

                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    皆様の
                    <span className="font-semibold text-blue-600">
                      貴重な時間とご協力
                    </span>
                    により、
                  </p>
                  <p className="text-lg">
                    快適なシステムを維持することができています。
                  </p>
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border-l-4 border-blue-400">
                    <p className="font-bold text-blue-800 text-xl">
                      ✨ 心より感謝申し上げます
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      お忙しい業務の合間に、ありがとうございます
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 特別な感謝セクション */}
          <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 rounded-3xl p-12 text-white text-center shadow-2xl relative overflow-hidden mb-16">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <div className="flex justify-center items-center gap-4 mb-8">
                <Gift className="h-12 w-12 text-yellow-300 animate-bounce" />
                <Sparkles className="h-16 w-16 text-yellow-300 animate-pulse" />
                <Gift className="h-12 w-12 text-yellow-300 animate-bounce delay-500" />
              </div>

              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                あなたは素晴らしい！
              </h2>

              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
                お忙しい中、手間をかけさせてしまい申し訳ございません。
                <br />
                それでも、
                <span className="font-bold text-yellow-300">
                  開発チームのために時間を使ってくださった
                </span>
                ことに
                <br />
                <span className="text-3xl font-bold">深く感謝しています</span>
              </p>

              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <Heart className="h-10 w-10 text-red-300 mx-auto mb-3" />
                  <h3 className="font-bold text-lg mb-2">思いやり</h3>
                  <p className="text-sm text-white/90">
                    みんなのことを考えて行動してくださる
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <Clock className="h-10 w-10 text-blue-300 mx-auto mb-3" />
                  <h3 className="font-bold text-lg mb-2">時間の投資</h3>
                  <p className="text-sm text-white/90">
                    貴重な時間を共有のために使ってくださる
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                  <Users className="h-10 w-10 text-green-300 mx-auto mb-3" />
                  <h3 className="font-bold text-lg mb-2">チームワーク</h3>
                  <p className="text-sm text-white/90">
                    みんなで作り上げる素晴らしいシステム
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 最終メッセージ */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl text-center border border-white/50">
            <div className="flex justify-center items-center gap-2 mb-6">
              {[...Array(7)].map((_, i) => (
                <Heart
                  key={i}
                  className="h-6 w-6 text-red-500 animate-pulse"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>

            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              🏢 座席管理システム
            </h2>

            <p className="text-xl text-gray-700 leading-relaxed mb-8 max-w-3xl mx-auto">
              今後ともご協力いただけましたら幸いです。
              <br />
              皆様のおかげで、このシステムは成り立っています。
            </p>

            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 border border-gray-200">
              <p className="text-lg font-semibold text-gray-800 mb-2">
                🙇‍♂️ 改めて、心からお礼申し上げます
              </p>
              <p className="text-gray-600">
                あなたの協力が、みんなの快適な職場環境を支えています
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
