"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>戻る</span>
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">当サービスについて</h1>

        <div className="space-y-6 text-gray-700">
          <section className="p-6 rounded-lg">
            <p>21:00に情報は全てリセットされます。</p>
            <br />
            <p>書くからちょっと待って...</p>
          </section>
        </div>

        <h2 className="text-3xl font-bold mb-6">今後の実装予定</h2>

        <div className="space-y-6 text-gray-700">
          <section className="bg-gray-50 p-6 rounded-lg">
            <ul className="list-disc list-inside space-y-2">
              <li>混雑具合と社内人口密度率の予測機能</li>
              <li>完全レスポンシブ対応</li>
              <li>セキュリティ強化</li>
              <li>投げ銭させる機能（冗談）</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
