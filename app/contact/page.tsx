"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ContactPage() {
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

        <div className="space-y-6 text-gray-700">
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-3">今後の実装予定</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                混雑具合、社内人口密度率をデータベースで管理し、混雑具合、社内人口密度率の予測機能
              </li>
              <li>ダークモード対応</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
