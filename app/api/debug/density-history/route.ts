import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  try {
    // density_historyテーブルの内容を確認
    const { data: historyData, error } = await supabaseAdmin
      .from("density_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        table_exists: false,
      });
    }

    // テーブル構造も確認
    const { data: tableInfo, error: tableError } = await supabaseAdmin
      .from("information_schema.columns")
      .select("column_name, data_type")
      .eq("table_name", "density_history")
      .eq("table_schema", "public");

    return NextResponse.json({
      success: true,
      data: historyData,
      count: historyData?.length || 0,
      table_structure: tableInfo,
      message: `density_historyテーブルから${
        historyData?.length || 0
      }件のデータを取得しました`,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "デバッグ情報の取得に失敗しました",
    });
  }
}
