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
      </div>
    </div>
  );
}
