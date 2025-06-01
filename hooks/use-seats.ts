import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface Seat {
  id: number;
  name: string | null;
  is_occupied: boolean; // Supabaseのカラム名に合わせて変更
}

// 日付が21時以降かどうかをチェック
const isAfter21 = (date = new Date()): boolean => {
  return date.getHours() >= 21;
};

export function useSeats() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [densityValue, setDensityValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [lastResetTime, setLastResetTime] = useState<Date | null>(null);

  // 空席の初期データを生成
  const createEmptySeats = () =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: null,
      is_occupied: false, // スネークケースに変更
    }));

  // 全ての座席と密集度をリセットする関数
  const resetAllSeats = async () => {
    const emptySeats = createEmptySeats();

    // Supabaseのテーブルを更新
    await supabase.from("seats").delete().neq("id", 0); // 全てのレコードを削除

    // 空の座席を一括挿入（パフォーマンス向上）
    await supabase.from("seats").upsert(emptySeats);

    // 密集度を更新
    await supabase.from("settings").upsert({ key: "density", value: 0 });

    setSeats(emptySeats);
    setDensityValue(0);
  };

  // 21時にリセットする関数
  const resetSeatsAt21 = async () => {
    if (isAfter21()) {
      const now = new Date();
      // 前回のリセットが今日でない場合のみリセット
      if (!lastResetTime || lastResetTime.getDate() !== now.getDate()) {
        await resetAllSeats();
        setLastResetTime(now);
      }
    }
  };

  // Supabaseからデータを取得
  useEffect(() => {
    const fetchInitialData = async () => {
      // 座席データを取得
      const { data: seatsData, error: seatsError } = await supabase
        .from("seats")
        .select("*")
        .order("id");

      if (seatsError) {
        console.error("座席データの取得に失敗しました:", seatsError);
      } else if (seatsData && seatsData.length > 0) {
        setSeats(seatsData);
      } else {
        // データがない場合は初期値をセット
        const initialSeats = createEmptySeats();
        setSeats(initialSeats);

        // データベースに初期値を一括保存（パフォーマンス向上）
        await supabase.from("seats").upsert(initialSeats);
      }

      // 密集度を取得
      const { data: densityData, error: densityError } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "density")
        .single();

      if (densityError && densityError.code !== "PGRST116") {
        // PGRST116: 結果がない場合のエラー
        console.error("密集度の取得に失敗しました:", densityError);
      } else {
        setDensityValue(densityData?.value || 0);

        // 密集度データがなければ作成
        if (!densityData) {
          await supabase.from("settings").upsert({ key: "density", value: 0 });
        }
      }

      setLoading(false);
    };

    // 初期データを取得
    fetchInitialData();

    // 初回とその後1分ごとに21時リセットをチェック
    resetSeatsAt21();
    const intervalId = setInterval(resetSeatsAt21, 60000); // 1分ごとにチェック

    // リアルタイムサブスクリプションを設定（座席情報）- 最適化
    const seatsSubscription = supabase
      .channel("seats-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "seats" },
        (payload) => {
          // ペイロードに基づいて座席データを更新（ネットワークリクエストなし）
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            const newSeat = payload.new as Seat;
            setSeats((currentSeats) =>
              currentSeats.map((seat) =>
                seat.id === newSeat.id ? newSeat : seat
              )
            );
          } else if (payload.eventType === "DELETE") {
            const oldSeat = payload.old as Seat;
            setSeats((currentSeats) =>
              currentSeats.filter((seat) => seat.id !== oldSeat.id)
            );
          }
        }
      )
      .subscribe();

    // リアルタイムサブスクリプションを設定（密集度）- 最適化
    const densitySubscription = supabase
      .channel("density-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "settings",
          filter: "key=eq.density",
        },
        (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            // ペイロードから直接値を取得
            const newSettings = payload.new as { key: string; value: number };
            if (newSettings && newSettings.key === "density") {
              setDensityValue(newSettings.value);
            }
          }
        }
      )
      .subscribe();

    // クリーンアップ関数
    return () => {
      clearInterval(intervalId);
      supabase.removeChannel(seatsSubscription);
      supabase.removeChannel(densitySubscription);
    };
  }, [lastResetTime]);

  // 座席の更新
  // 更新エラーを管理するための状態
  const [error, setError] = useState<string | null>(null);

  const updateSeat = async (seatId: number, updates: Partial<Seat>) => {
    try {
      setError(null);
      const seatIndex = seats.findIndex((s) => s.id === seatId);
      if (seatIndex === -1) {
        setError(`座席ID ${seatId} が見つかりません`);
        return;
      }

      const updatedSeat = { ...seats[seatIndex], ...updates };

      // Supabaseデータを更新
      const { data, error } = await supabase.from("seats").upsert(updatedSeat);

      if (error) {
        setError(`座席の更新に失敗しました: ${error.message}`);
        throw error;
      }

      // ローカルステートも更新して即時反映
      setSeats((prevSeats) =>
        prevSeats.map((seat) =>
          seat.id === seatId ? { ...seat, ...updates } : seat
        )
      );
    } catch (e) {
      if (e instanceof Error) {
        setError(`エラー: ${e.message}`);
      } else {
        setError("予期せぬエラーが発生しました");
      }
    }
  };

  // 座席の占有
  const occupySeat = async (seatId: number, name: string) => {
    await updateSeat(seatId, { name, is_occupied: true });
  };

  // 座席の解放
  const releaseSeat = async (seatId: number) => {
    await updateSeat(seatId, { name: null, is_occupied: false });
  };

  // 密集度の更新
  const updateDensity = async (value: number) => {
    const newValue = Math.max(0, Math.min(100, value)); // 0〜100の範囲に制限

    // Supabaseに更新を保存
    const { error } = await supabase
      .from("settings")
      .upsert({ key: "density", value: newValue });

    if (error) {
      console.error("密集度の更新に失敗しました:", error);
    } else {
      setDensityValue(newValue);
    }
  };

  return {
    seats,
    densityValue,
    loading,
    error,
    occupySeat,
    releaseSeat,
    updateDensity,
    resetAllSeats,
  };
}
