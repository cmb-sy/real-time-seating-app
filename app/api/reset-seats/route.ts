import { supabase } from "@/lib/supabase";

// 空席の初期データを生成
const createEmptySeats = () =>
  Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: null,
    is_occupied: false,
    updated_date: new Date().toTimeString().split(" ")[0],
  }));

export async function POST(request: Request) {
  try {
    const { authorization } = await request.json();

    // 認証チェック
    if (authorization !== process.env.RESET_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "認証エラー",
          timestamp: new Date().toISOString(),
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 空席データを生成
    const emptySeats = createEmptySeats();

    // トランザクション的な処理を実行
    const { error: deleteError } = await supabase
      .from("seats")
      .delete()
      .neq("id", 0);
    if (deleteError) {
      throw new Error(`座席データの削除に失敗: ${deleteError.message}`);
    }

    const { error: insertError } = await supabase
      .from("seats")
      .upsert(emptySeats);
    if (insertError) {
      throw new Error(`新しい座席データの挿入に失敗: ${insertError.message}`);
    }

    const { error: densityError } = await supabase
      .from("settings")
      .upsert({ key: "density", value: 0 });
    if (densityError) {
      throw new Error(`密集度の更新に失敗: ${densityError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "座席情報をリセットしました",
        timestamp: new Date().toISOString(),
        seatsCount: emptySeats.length,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("座席リセット中にエラーが発生しました:", error);
    const errorMessage =
      error instanceof Error ? error.message : "不明なエラーが発生しました";
    return new Response(
      JSON.stringify({
        error: "座席リセット中にエラーが発生しました",
        details: errorMessage,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
