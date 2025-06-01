import { supabase } from "@/lib/supabase";

// 空席の初期データを生成
const createEmptySeats = () =>
  Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: null,
    is_occupied: false,
  }));

export async function POST(request: Request) {
  try {
    const { authorization } = await request.json();

    // 簡易的な認証チェック - 本番環境では適切な認証を実装してください
    if (authorization !== process.env.RESET_API_KEY) {
      return new Response(JSON.stringify({ error: "認証エラー" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 空席データを生成
    const emptySeats = createEmptySeats();

    // Supabaseのテーブルをリセット
    await supabase.from("seats").delete().neq("id", 0); // 全てのレコードを削除

    // 空の座席を一括挿入
    await supabase.from("seats").upsert(emptySeats);

    // 密集度を更新
    await supabase.from("settings").upsert({ key: "density", value: 0 });

    return new Response(
      JSON.stringify({ success: true, message: "座席情報をリセットしました" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("リセット処理中にエラーが発生しました:", error);
    return new Response(
      JSON.stringify({ error: "リセット処理中にエラーが発生しました" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
