import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { z } from "zod";

// 入力データ検証用のスキーマ
const feedbackSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // 入力データのバリデーション
    const result = feedbackSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, email, message } = result.data;

    // メール送信の設定
    // 注意: 実際の環境変数に置き換える必要があります
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.example.com",
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER || "user@example.com",
        pass: process.env.SMTP_PASSWORD || "password",
      },
    });

    // 管理者向けメール設定
    const mailOptions = {
      from: process.env.MAIL_FROM || "noreply@seatmanagement.example.com",
      to: process.env.MAIL_TO || "admin@example.com",
      subject: `【座席管理システム】機能改善要望: ${name}様より`,
      text: `
名前: ${name}
メールアドレス: ${email}

【要望内容】
${message}
      `,
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">座席管理システム - 機能改善要望</h2>
  
  <div style="margin: 20px 0;">
    <p><strong>送信者:</strong> ${name}</p>
    <p><strong>メールアドレス:</strong> ${email}</p>
  </div>
  
  <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px;">
    <h3 style="margin-top: 0; color: #555;">要望内容:</h3>
    <p style="white-space: pre-line;">${message}</p>
  </div>
  
  <p style="color: #777; font-size: 0.9em; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
    このメールは座席管理システムから自動送信されています。
  </p>
</div>
      `,
    };

    // 自動返信メール設定
    const autoReplyOptions = {
      from: process.env.MAIL_FROM || "noreply@seatmanagement.example.com",
      to: email,
      subject: "【座席管理システム】ご要望を受け付けました",
      text: `
${name} 様

座席管理システムへのご要望をお送りいただき、ありがとうございます。
以下の内容で承りました。

【ご要望内容】
${message}

内容を確認の上、検討させていただきます。
回答が必要な内容の場合は、後日担当者よりご連絡いたします。

---------------------------------------
座席管理システム 運営チーム
※ このメールは自動送信されています。返信はできませんのでご了承ください。
      `,
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">座席管理システム - ご要望受付完了</h2>
  
  <p>${name} 様</p>
  
  <p>座席管理システムへのご要望をお送りいただき、ありがとうございます。<br>
  以下の内容で承りました。</p>
  
  <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px;">
    <h3 style="margin-top: 0; color: #555;">ご要望内容:</h3>
    <p style="white-space: pre-line;">${message}</p>
  </div>
  
  <p>内容を確認の上、検討させていただきます。<br>
  回答が必要な内容の場合は、後日担当者よりご連絡いたします。</p>
  
  <p style="color: #777; font-size: 0.9em; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
    座席管理システム 運営チーム<br>
    ※ このメールは自動送信されています。返信はできませんのでご了承ください。
  </p>
</div>
      `,
    };
    try {
      // Promise.allを使用して両方のメールを並行して送信（パフォーマンス向上）
      await Promise.all([
        transporter.sendMail(mailOptions),
        transporter.sendMail(autoReplyOptions),
      ]);
    } catch (mailError) {
      console.error("メール送信エラー:", mailError);
      throw mailError;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("メール送信エラー:", error);
    return NextResponse.json(
      { error: "メール送信に失敗しました" },
      { status: 500 }
    );
  }
}
