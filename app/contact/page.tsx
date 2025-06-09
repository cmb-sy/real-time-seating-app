"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // フォーム送信のハンドリング
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    try {
      // SSGformに送信
      const response = await fetch("https://ssgform.com/s/9TBp9oe5J3wt", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setIsSubmitted(true);
        // フォームをリセット
        (e.target as HTMLFormElement).reset();
      } else {
        throw new Error("送信に失敗しました");
      }
    } catch (error) {
      console.error("送信エラー:", error);
      alert("送信に失敗しました。しばらく経ってから再度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

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

        {/* お問い合わせフォームセクション */}
        <section className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-5">機能改善のご要望</h2>
          {isSubmitted ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-md">
              <p className="font-medium">ご要望を受け付けました</p>
              <p className="text-sm mt-2">
                ありがとうございました。検討させていただきます。
              </p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => setIsSubmitted(false)}
              >
                新しい要望を送信する
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">お名前 *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="山田太郎"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">ご要望内容 *</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="希望する機能や改善点についてご記入ください"
                  className="min-h-[120px]"
                  required
                />
              </div>

              {/* SSGform用の隠しフィールド */}
              <input
                type="hidden"
                name="form_type"
                value="座席管理システム要望"
              />
              <input
                type="hidden"
                name="timestamp"
                value={new Date().toISOString()}
              />

              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    送信中...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="w-4 h-4 mr-2" />
                    要望を送信する
                  </span>
                )}
              </Button>

              <div className="text-sm text-gray-600 mt-4">
                <p>
                  * 必須項目
                  <br />
                  送信されたご要望は、管理者メールアドレスに送信されます。
                </p>
              </div>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
