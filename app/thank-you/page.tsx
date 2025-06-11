"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft, Heart, Sparkles } from "lucide-react";

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 hover:bg-white/80"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>戻る</span>
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="flex justify-center items-center mb-6">
            <div className="relative">
              <CheckCircle className="h-16 w-16 text-green-500" />
              <Sparkles className="h-6 w-6 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            本当にありがとうございます🙇‍♂️
          </h1>

          <div className="mb-8 space-y-6">
            <div className="flex justify-center mb-4">
              <Heart className="h-8 w-8 text-red-500 animate-pulse" />
            </div>

            <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-400">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                <strong>お忙しい中、貴重なお時間を割いていただき、</strong>
                <br />
                <strong>本当にありがとうございました。</strong>
              </p>
              <p className="text-base text-gray-600 leading-relaxed">
                正直なところ、座席情報の入力は面倒な作業だと思います。
                <br />
                それでも、わざわざ手間をかけて、時間を取って、
                <br />
                ご協力いただいたことを心から感謝いたします。
              </p>
            </div>

            <div className="bg-red-50 p-6 rounded-xl border-l-4 border-red-400">
              <p className="text-base text-red-800 leading-relaxed">
                <strong>
                  申し訳ない気持ちと、感謝の気持ちでいっぱいです。
                </strong>
              </p>
              <p className="text-sm text-red-700 mt-2 leading-relaxed">
                お忙しい業務の合間に、こんなめんどくさい作業をお願いしてしまい、
                本当に申し訳ございません。それと同時に、
                みんなのために時間を使ってくださったことに深く感謝しています。
              </p>
            </div>

            <div className="bg-green-50 p-6 rounded-xl border-l-4 border-green-400">
              <p className="text-base text-green-800 leading-relaxed">
                <strong>あなたの一つ一つの行動が、</strong>
                <br />
                <strong>みんなの働きやすさに繋がっています。</strong>
              </p>
              <p className="text-sm text-green-700 mt-2 leading-relaxed">
                面倒な入力作業も、手間のかかる更新作業も、
                すべてがオフィス全体の快適さを支えています。
                本当に、本当にありがとうございます。
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl mb-8">
            <h2 className="text-xl font-semibold text-blue-800 mb-3">
              🏢 座席管理システム
            </h2>
            <p className="text-blue-700 leading-relaxed">
              皆様の貴重な時間とご協力により、
              <br />
              快適なオフィス環境を維持することができています。
              <br />
              <strong>心より感謝申し上げます。</strong>
            </p>
          </div>

          <div className="space-y-4">
            <Link href="/">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-lg">
                座席状況を確認する
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" className="w-full py-3 text-lg">
                システムについて詳しく見る
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 leading-relaxed">
              お忙しい中、手間をかけさせてしまい申し訳ございません。
              <br />
              今後ともご協力いただけましたら幸いです 🌟
              <br />
              <strong>本当にありがとうございました。</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
