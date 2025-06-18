import { NextRequest, NextResponse } from "next/server";

// 環境に応じたMLバックエンドURL
const ML_BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? process.env.ML_BACKEND_URL ||
      "https://real-time-seating-app-ml.vercel.app"
    : "http://localhost:8000";

// CORSヘッダーを設定する関数
const setCorsHeaders = () => ({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
});

// OPTIONSメソッド（CORSプリフライト）
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: setCorsHeaders(),
  });
}

// 週間平均データ取得API
export async function GET(request: NextRequest) {
  try {
    // MLバックエンドから週間平均データを取得
    const response = await fetch(
      `${ML_BACKEND_URL}/api/predictions/weekly-averages`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // CORSエラーを回避するため、サーバーサイドでフェッチ
      }
    );

    if (!response.ok) {
      // MLサーバーからのエラーレスポンスを取得
      let errorMessage = `MLサーバーエラー: ${response.status}`;
      try {
        const errorData = await response.json();
        if (errorData.error) {
          errorMessage = `MLサーバーエラー: ${errorData.error}`;
        }
      } catch (parseError) {
        console.error("MLサーバーエラーレスポンスの解析に失敗:", parseError);
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();

    // 成功レスポンスの場合
    if (data.success) {
      // CORSヘッダーを追加してレスポンス
      return NextResponse.json(data, {
        status: 200,
        headers: setCorsHeaders(),
      });
    } else {
      // MLサーバーからのエラーレスポンス
      throw new Error(
        data.error || "MLサーバーで予期しないエラーが発生しました"
      );
    }
  } catch (error) {
    console.error("週間平均データ取得エラー:", error);

    // 環境に関係なく常にエラーレスポンスを返す
    const errorResponse = {
      success: false,
      error:
        error instanceof Error ? error.message : "MLサーバーに接続できません",
      data: null,
      details:
        process.env.NODE_ENV === "production"
          ? "MLサーバーとの接続に失敗しました。しばらく時間をおいてから再度お試しください。"
          : "開発環境: MLサーバー(localhost:8000)が起動していない可能性があります。",
    };

    return NextResponse.json(errorResponse, {
      status: 503,
      headers: setCorsHeaders(),
    });
  }
}
