import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

// 入力データ検証用のスキーマ
const feedbackSchema = z.object({
  name: z.string().min(1),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    // Step 1: データ受信テスト
    const body = await request.json();

    // Step 2: バリデーションテスト
    const result = feedbackSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "バリデーションエラー", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, message } = result.data;

    // Step 3: Supabase接続テスト
    try {
      const { data: loginData, error: loginError } = await supabase
        .from("login")
        .select("mail")
        .eq("id", "armdx")
        .single();

      if (loginError) {
        return NextResponse.json(
          {
            error: "Supabaseエラー",
            details: loginError.message,
            code: loginError.code,
          },
          { status: 500 }
        );
      }

      if (!loginData?.mail) {
        return NextResponse.json(
          {
            error: "メールアドレス未設定",
            details: "loginテーブルのmailカラムが空です",
            loginData: loginData,
          },
          { status: 500 }
        );
      }

      // Step 4: 成功レスポンス（実際のメール送信はスキップ）
      return NextResponse.json({
        success: true,
        message: `テスト成功: 要望を受け付けました`,
        debug: {
          name: name,
          messageLength: message.length,
          adminEmail: loginData.mail,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (supabaseError) {
      return NextResponse.json(
        {
          error: "Supabase接続エラー",
          details:
            supabaseError instanceof Error
              ? supabaseError.message
              : "不明なエラー",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: "API全体エラー",
        details: error instanceof Error ? error.message : "不明なエラー",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}
