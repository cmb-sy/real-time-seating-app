"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, Users, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { HeaderNav } from "@/components/ui/header-nav";

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
    <>
      <HeaderNav />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          {/* ご要望フォーム */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 p-8 relative overflow-hidden">
            {/* 背景装飾 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-2xl"></div>

            <div className="relative">
              {/* タイトル */}
              <div className="text-center mb-8">
                <div className="flex justify-center items-center gap-3 mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full p-3">
                    <MessageSquare className="h-8 w-8 text-white" />
                  </div>
                  <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
                </div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                  ご要望フォーム
                </h1>
                <p className="text-gray-600 leading-relaxed">
                  機能改善のご要望やご意見をお聞かせください。
                  <br />
                  いただいたご意見は、時間があるときに検討させていただきます。
                </p>
              </div>

              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="flex justify-center items-center gap-2 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                    <h3 className="text-xl font-bold text-green-800 mb-3">
                      ありがとうございました！
                    </h3>
                    <p className="text-green-700 mb-6 leading-relaxed">
                      貴重なご要望を受け付けました。
                      <br />
                      検討させていただきます。
                    </p>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      新しい要望を送信する
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label
                      htmlFor="name"
                      className="text-lg font-semibold text-gray-800 flex items-center gap-2"
                    >
                      <Users className="h-5 w-5 text-blue-600" />
                      お名前
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="あなたの名前を入力してください"
                      required
                      className="h-12 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200 bg-white/70 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="message"
                      className="text-lg font-semibold text-gray-800 flex items-center gap-2"
                    >
                      <MessageSquare className="h-5 w-5 text-blue-600" />
                      ご要望内容
                    </Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="デザインがダサすぎる"
                      className="min-h-[140px] text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all duration-200 bg-white/70 backdrop-blur-sm resize-none"
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
                    className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
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
                      <span className="flex items-center justify-center">
                        <Send className="w-6 h-6 mr-3" />
                        要望を送信する
                      </span>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
