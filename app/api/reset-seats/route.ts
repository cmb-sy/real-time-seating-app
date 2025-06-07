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
    // 全座席データを削除
    const { error: deleteError } = await supabase
      .from("seats")
      .delete()
      .gte("id", 1)
      .lte("id", 8);
    if (deleteError) {
      throw new Error(`座席データの削除に失敗: ${deleteError.message}`);
    }

    // 削除後の状態を確認
    const { data: checkData, error: checkError } = await supabase
      .from("seats")
      .select("*");
    if (checkError) {
      throw new Error(`削除確認に失敗: ${checkError.message}`);
    }
    console.log("削除後の座席データ:", checkData);

    // 新しい空席データを挿入
    const { error: insertError } = await supabase
      .from("seats")
      .insert(emptySeats)
      .select();
    if (insertError) {
      throw new Error(`新しい座席データの挿入に失敗: ${insertError.message}`);
    }

    // 挿入後の状態を確認
    const { data: finalData, error: finalError } = await supabase
      .from("seats")
      .select("*")
      .order("id");
    if (finalError) {
      throw new Error(`最終確認に失敗: ${finalError.message}`);
    }
    console.log("リセット後の最終データ:", finalData);

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
