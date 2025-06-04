"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// フォームのスキーマを定義
const formSchema = z.object({
  name: z.string().min(1, {
    message: "名前を入力してください",
  }),
  email: z.string().email({
    message: "有効なメールアドレスを入力してください",
  }),
  message: z.string().min(10, {
    message: "メッセージは最低10文字以上入力してください",
  }),
});

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // フォームの状態を管理
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // フォーム送信時の処理
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);

    try {
      // APIエンドポイントにPOSTリクエストを送信
      const response = await fetch("/api/send-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "送信に失敗しました");
      }

      // 成功した場合の処理
      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      console.error("送信エラー:", error);
      alert(
        "メールの送信に失敗しました。しばらく経ってから再度お試しください。"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

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
          <h2 className="text-xl font-semibold mb-5">
            機能改善のご要望(まだ使えません)
          </h2>
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>メールアドレス</FormLabel>
                      <FormControl>
                        <Input placeholder="example@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ご要望内容</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="希望する機能や改善点についてご記入ください(e.g. システム重すぎ直せよタコ)"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
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
              </form>
            </Form>
          )}
        </section>
      </div>
    </div>
  );
}
