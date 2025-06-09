import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";
import { supabase } from "@/lib/supabase";

// 入力データ検証用のスキーマ
const feedbackSchema = z.object({
  name: z.string().min(1),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    console.log("=== フィードバック送信API開始 ===");

    const body = await request.json();
    console.log("受信データ:", {
      name: body.name,
      messageLength: body.message?.length,
    });

    // バリデーション
    const result = feedbackSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "バリデーションエラー", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, message } = result.data;

    // Supabaseからメールアドレスを取得
    console.log("=== Supabaseからメールアドレス取得 ===");
    const { data: loginData, error: loginError } = await supabase
      .from("login")
      .select("mail")
      .eq("id", "armdx")
      .single();

    if (loginError) {
      console.error("Supabaseエラー:", loginError);
      return NextResponse.json(
        { error: "データベースエラー", details: loginError.message },
        { status: 500 }
      );
    }

    if (!loginData?.mail) {
      console.error("メールアドレス未設定");
      return NextResponse.json(
        { error: "管理者メールアドレスが設定されていません" },
        { status: 500 }
      );
    }

    const adminEmail = loginData.mail;
    console.log("送信先メールアドレス:", adminEmail);

    // メール送信設定（Gmailの場合の例）
    const transporter = nodemailer.createTransport({
      service: "gmail", // Gmailサービスを使用
      auth: {
        user: process.env.SMTP_USER, // 送信者のGmailアドレス
        pass: process.env.SMTP_APP_PASSWORD, // Gmailアプリパスワード
      },
      // 配信性を向上させるための設定
      pool: true,
      maxConnections: 1,
      rateDelta: 20000,
      rateLimit: 5,
    });

    // メール内容
    const mailOptions = {
      from: {
        name: "座席管理システム",
        address: process.env.SMTP_USER || "noreply@example.com",
      },
      to: adminEmail,
      subject: `【座席管理システム】機能改善要望: ${name}様より`,
      text: `
件名: 座席管理システム機能改善要望

送信者: ${name}
送信日時: ${new Date().toLocaleString("ja-JP")}

【要望内容】
${message}

---
このメールは座席管理システムから自動送信されています。
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>座席管理システム - 機能改善要望</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <h2 style="color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px;">
      座席管理システム - 機能改善要望
    </h2>
    
    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p><strong>送信者:</strong> ${name}</p>
      <p><strong>送信日時:</strong> ${new Date().toLocaleString("ja-JP")}</p>
    </div>
    
    <div style="background: #ffffff; border: 1px solid #dee2e6; padding: 20px; border-radius: 5px; margin: 20px 0;">
      <h3 style="color: #495057; margin-top: 0;">要望内容:</h3>
      <p style="white-space: pre-line; background: #f8f9fa; padding: 15px; border-radius: 3px;">${message}</p>
    </div>
    
    <div style="border-top: 1px solid #dee2e6; padding-top: 20px; font-size: 14px; color: #6c757d;">
      <p>このメールは座席管理システムから自動送信されています。</p>
      <p>送信先: ${adminEmail}</p>
    </div>
  </div>
</body>
</html>
      `,
    };

    // メール送信実行
    console.log("=== メール送信実行 ===");
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("メール送信成功:", {
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
        response: info.response,
      });

      return NextResponse.json({
        success: true,
        message: `要望を受け付けました`,
        details: {
          messageId: info.messageId,
          adminEmail: adminEmail,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (mailError) {
      console.error("メール送信エラー:", mailError);

      // SMTPエラーの詳細を返す
      return NextResponse.json(
        {
          error: "メール送信に失敗しました",
          details:
            mailError instanceof Error ? mailError.message : "不明なエラー",
          smtpConfig: {
            service: "gmail",
            user: process.env.SMTP_USER ? "設定済み" : "未設定",
            pass: process.env.SMTP_APP_PASSWORD ? "設定済み" : "未設定",
          },
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API全体エラー:", error);
    return NextResponse.json(
      {
        error: "サーバーエラー",
        details: error instanceof Error ? error.message : "不明なエラー",
      },
      { status: 500 }
    );
  }
}
