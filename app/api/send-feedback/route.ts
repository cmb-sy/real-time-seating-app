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
    const body = await request.json();

    // 入力データのバリデーション
    const result = feedbackSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid input data", details: result.error.format() },
        { status: 400 }
      );
    }

    const { name, message } = result.data;

    // loginテーブルからメールアドレスを取得
    const { data: loginData, error: loginError } = await supabase
      .from("login")
      .select("mail")
      .eq("id", "armdx")
      .single();

    if (loginError) {
      console.error("管理者メール取得エラー:", loginError);
      return NextResponse.json(
        { error: "管理者情報の取得に失敗しました" },
        { status: 500 }
      );
    }

    if (!loginData?.mail) {
      console.error("管理者のメールアドレスが設定されていません");
      return NextResponse.json(
        { error: "管理者のメールアドレスが設定されていません" },
        { status: 500 }
      );
    }

    const adminEmail = loginData.mail;

    // メール送信の設定
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
      to: adminEmail, // loginテーブルから取得したメールアドレスを使用
      subject: `【座席管理システム】機能改善要望: ${name}様より`,
      text: `
名前: ${name}

【要望内容】
${message}
      `,
      html: `
<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333; border-bottom: 1px solid #eee; padding-bottom: 10px;">座席管理システム - 機能改善要望</h2>
  
  <div style="margin: 20px 0;">
    <p><strong>送信者:</strong> ${name}</p>
  </div>
  
  <div style="margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px;">
    <h3 style="margin-top: 0; color: #555;">要望内容:</h3>
    <p style="white-space: pre-line;">${message}</p>
  </div>
  
  <p style="color: #777; font-size: 0.9em; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
    このメールは座席管理システムから自動送信されています。<br>
    送信先: ${adminEmail}
  </p>
</div>
      `,
    };

    try {
      // 管理者宛メールのみ送信
      await transporter.sendMail(mailOptions);
      console.log(`メールを送信しました: ${adminEmail} 宛て`);
    } catch (mailError) {
      console.error("メール送信エラー:", mailError);
      throw mailError;
    }

    return NextResponse.json({
      success: true,
      message: `要望が正常に送信されました（送信先: ${adminEmail}）`,
    });
  } catch (error) {
    console.error("メール送信エラー:", error);
    return NextResponse.json(
      { error: "メール送信に失敗しました" },
      { status: 500 }
    );
  }
}
