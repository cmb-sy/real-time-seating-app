import { NextRequest, NextResponse } from "next/server";

const ML_BACKEND_URL = "http://localhost:8000";

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

    // エラーレスポンスを返す（ダミーデータなし）
    const errorResponse = {
      success: false,
      error:
        error instanceof Error ? error.message : "MLサーバーに接続できません",
      data: null,
      details:
        "MLサーバーでデータベース接続エラーが発生しています。管理者にお問い合わせください。",
    };

    return NextResponse.json(errorResponse, {
      status: 503,
      headers: setCorsHeaders(),
    });
  }
}
