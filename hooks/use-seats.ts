import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

interface Seat {
  id: number;
  name: string | null;
  is_occupied: boolean;
  updated_date?: string;
}

export function useSeats() {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [densityValue, setDensityValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 空席の初期データを生成（初期データのみ使用）
  const createEmptySeats = () =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: null,
      is_occupied: false,
      updated_date: new Date().toTimeString().substring(0, 5),
    }));

  // Supabaseからデータを取得
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 座席データと社内人口密度率を並列で取得
        const [seatsResponse, densityResponse] = await Promise.all([
          supabase.from("seats").select("*").order("id"),
          supabase
            .from("settings")
            .select("value")
            .eq("key", "density")
            .maybeSingle(),
        ]);

        // 座席データの処理
        if (seatsResponse.error) {
          console.error("座席データの取得に失敗しました:", seatsResponse.error);
        } else if (seatsResponse.data && seatsResponse.data.length > 0) {
          setSeats(seatsResponse.data);
        } else {
          // データがない場合は初期値をセット
          const initialSeats = createEmptySeats();
          setSeats(initialSeats);
          // データベースに初期値を保存
          await supabase.from("seats").upsert(initialSeats);
        }

        // 社内人口密度率の処理
        if (
          densityResponse.error &&
          densityResponse.error.code !== "PGRST116"
        ) {
          console.error(
            "社内人口密度率の取得に失敗しました:",
            densityResponse.error
          );
        } else {
          setDensityValue(densityResponse.data?.value || 0);
          if (!densityResponse.data) {
            await supabase
              .from("settings")
              .upsert({ key: "density", value: 0 });
          }
        }
      } catch (err) {
        console.error("データ取得中にエラーが発生しました:", err);
      }

      setLoading(false);
    };

    // 初期データを取得
    fetchInitialData();

    // リアルタイムサブスクリプションを設定（座席情報）
    const seatsSubscription = supabase
      .channel("seats-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "seats" },
        (payload) => {
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

    // リアルタイムサブスクリプションを設定（密集度）
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
      supabase.removeChannel(seatsSubscription);
      supabase.removeChannel(densitySubscription);
    };
  }, []);

  // 座席の更新
  const updateSeat = async (seatId: number, updates: Partial<Seat>) => {
    try {
      setError(null);
      const seat = seats.find((s) => s.id === seatId);
      if (!seat) {
        setError(`座席ID ${seatId} が見つかりません`);
        return;
      }

      const now = new Date();
      // HH:MM形式に統一
      const timeString = now.toTimeString().substring(0, 5);
      const updatedSeat = {
        ...seat,
        ...updates,
        updated_date: timeString,
      };

      const { error } = await supabase.from("seats").upsert(updatedSeat);
      if (error) {
        setError(`座席の更新に失敗しました: ${error.message}`);
        throw error;
      }

      // ローカルステートを即時更新
      setSeats((prevSeats) =>
        prevSeats.map((s) => (s.id === seatId ? updatedSeat : s))
      );
    } catch (e) {
      if (e instanceof Error) {
        setError(`エラー: ${e.message}`);
      } else {
        setError("予期せぬエラーが発生しました");
      }
    }
  };

  const occupySeat = useCallback(async (seatId: number, name: string) => {
    await updateSeat(seatId, { name, is_occupied: true });
  }, []);

  const releaseSeat = useCallback(async (seatId: number) => {
    await updateSeat(seatId, { name: null, is_occupied: false });
  }, []);

  const updateDensity = async (value: number) => {
    const newValue = Math.max(0, Math.min(100, value));
    const { error } = await supabase
      .from("settings")
      .upsert({ key: "density", value: newValue });
    if (error) {
      console.error("社内人口密度率の更新に失敗しました:", error);
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
  };
}
