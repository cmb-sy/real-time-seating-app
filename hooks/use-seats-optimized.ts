import { useState, useEffect, useCallback, useRef } from "react";
import { supabase, supabaseAdmin } from "@/lib/supabase";

interface Seat {
  id: number;
  name: string | null;
  is_occupied: boolean;
  updated_date?: string;
}

export function useSeatsOptimized() {
  // 座席を固定配列として初期化（1-8の順序を絶対に保持）
  const [seats, setSeats] = useState<Seat[]>(() =>
    Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      name: null,
      is_occupied: false,
      updated_date: new Date().toTimeString().substring(0, 5),
    }))
  );

  const [densityValue, setDensityValue] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 更新中の座席IDを追跡（重複更新防止）
  const updatingSeats = useRef<Set<number>>(new Set());

  // 最後の更新時刻を追跡（デバウンス用）
  const lastUpdateTime = useRef<{ [key: number]: number }>({});

  // 空席の初期データを生成
  const createEmptySeats = useCallback(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        name: null,
        is_occupied: false,
        updated_date: new Date().toTimeString().substring(0, 5),
      })),
    []
  );

  // 座席の即座更新（楽観的更新）- 順序を絶対に変更しない
  const updateSeatOptimistic = useCallback(
    (seatId: number, updates: Partial<Seat>) => {
      const now = new Date();
      const timeString = now.toTimeString().substring(0, 5);

      setSeats((prevSeats) => {
        // 固定配列を作成し、該当する座席のみ更新
        const newSeats = [...prevSeats];
        const seatIndex = seatId - 1; // ID 1-8 を インデックス 0-7 に変換

        if (seatIndex >= 0 && seatIndex < 8) {
          newSeats[seatIndex] = {
            ...newSeats[seatIndex],
            ...updates,
            updated_date: timeString,
          };
        }

        return newSeats; // ソートしない！順序を絶対に保持
      });
    },
    []
  );

  // 座席の更新（高速化版）
  const updateSeat = useCallback(
    async (seatId: number, updates: Partial<Seat>) => {
      // 重複更新チェック
      if (updatingSeats.current.has(seatId)) {
        console.log(`⏭️ 座席${seatId}は既に更新中です`);
        return;
      }

      // デバウンス処理
      const now = Date.now();
      const lastUpdate = lastUpdateTime.current[seatId] || 0;
      if (now - lastUpdate < 500) {
        // 500ms以内の連続更新を防ぐ
        console.log(`⏭️ 座席${seatId}の更新をデバウンスしました`);
        return;
      }

      try {
        setError(null);
        updatingSeats.current.add(seatId);
        lastUpdateTime.current[seatId] = now;

        // 即座にローカル状態を更新（楽観的更新）
        updateSeatOptimistic(seatId, updates);

        // 現在の座席データを取得
        const { data: currentSeat, error: fetchError } = await supabaseAdmin
          .from("seats")
          .select("*")
          .eq("id", seatId)
          .single();

        if (fetchError || !currentSeat) {
          throw new Error(`座席ID ${seatId} が見つかりません`);
        }

        const timeString = new Date().toTimeString().substring(0, 5);
        const updatedSeat = {
          ...currentSeat,
          ...updates,
          updated_date: timeString,
        };

        // データベースを更新
        const { error } = await supabaseAdmin.from("seats").upsert(updatedSeat);
        if (error) {
          // エラーの場合は元の状態に戻す
          updateSeatOptimistic(seatId, currentSeat);
          throw error;
        }

        console.log(`✅ 座席${seatId}の更新完了`);
      } catch (e) {
        const errorMessage =
          e instanceof Error ? e.message : "予期せぬエラーが発生しました";
        console.error(`❌ 座席${seatId}の更新エラー:`, errorMessage);
        setError(errorMessage);
      } finally {
        updatingSeats.current.delete(seatId);
      }
    },
    [updateSeatOptimistic]
  );

  // 座席操作関数
  const occupySeat = useCallback(
    async (seatId: number, name: string) => {
      console.log(`🪑 座席${seatId}に${name}さんが着席`);
      await updateSeat(seatId, { name, is_occupied: true });
    },
    [updateSeat]
  );

  const releaseSeat = useCallback(
    async (seatId: number) => {
      console.log(`🚪 座席${seatId}から退席`);
      await updateSeat(seatId, { name: null, is_occupied: false });
    },
    [updateSeat]
  );

  const updateName = useCallback(
    async (seatId: number, name: string) => {
      console.log(`✏️ 座席${seatId}の名前を${name}に変更`);
      await updateSeat(seatId, { name });
    },
    [updateSeat]
  );

  // 密度更新
  const updateDensity = useCallback(async (value: number) => {
    const newValue = Math.max(0, Math.min(100, value));
    try {
      const { error } = await supabaseAdmin
        .from("settings")
        .upsert({ key: "density", value: newValue });
      if (error) throw error;
      setDensityValue(newValue);
    } catch (error) {
      console.error("社内人口密度率の更新に失敗:", error);
    }
  }, []);

  // 初期化とリアルタイム更新
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // 座席データと密度を並列取得
        const [seatsResponse, densityResponse] = await Promise.all([
          supabaseAdmin.from("seats").select("*").order("id"),
          supabaseAdmin
            .from("settings")
            .select("value")
            .eq("key", "density")
            .maybeSingle(),
        ]);

        // 座席データの処理 - 固定配列に配置
        if (seatsResponse.error) {
          console.error("座席データの取得に失敗:", seatsResponse.error);
        } else if (seatsResponse.data && seatsResponse.data.length > 0) {
          // 固定配列を作成し、データベースの座席を適切な位置に配置
          const fixedSeats = Array.from({ length: 8 }, (_, i) => {
            const seatId = i + 1;
            const foundSeat = seatsResponse.data.find((s) => s.id === seatId);
            return (
              foundSeat || {
                id: seatId,
                name: null,
                is_occupied: false,
                updated_date: new Date().toTimeString().substring(0, 5),
              }
            );
          });
          setSeats(fixedSeats);
        } else {
          // 初期データを作成
          const initialSeats = createEmptySeats();
          setSeats(initialSeats);
          await supabaseAdmin.from("seats").upsert(initialSeats);
        }

        // 密度データの処理
        if (
          densityResponse.error &&
          densityResponse.error.code !== "PGRST116"
        ) {
          console.error("密度データの取得に失敗:", densityResponse.error);
        } else {
          setDensityValue(densityResponse.data?.value || 0);
          if (!densityResponse.data) {
            await supabaseAdmin
              .from("settings")
              .upsert({ key: "density", value: 0 });
          }
        }
      } catch (err) {
        console.error("初期データ取得エラー:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();

    // リアルタイムサブスクリプション（座席）- 順序を絶対に変更しない
    const seatsSubscription = supabase
      .channel("seats-optimized")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "seats" },
        (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            const newSeat = payload.new as Seat;

            // 自分が更新中の座席は無視（重複更新防止）
            if (updatingSeats.current.has(newSeat.id)) {
              console.log(`⏭️ 座席${newSeat.id}は自分が更新中のためスキップ`);
              return;
            }

            setSeats((currentSeats) => {
              // 既存の座席と比較して変更があるかチェック
              const seatIndex = newSeat.id - 1; // ID 1-8 を インデックス 0-7 に変換

              if (seatIndex < 0 || seatIndex >= 8) {
                return currentSeats; // 無効なIDの場合は何もしない
              }

              const currentSeat = currentSeats[seatIndex];
              if (
                currentSeat &&
                currentSeat.name === newSeat.name &&
                currentSeat.is_occupied === newSeat.is_occupied &&
                currentSeat.updated_date === newSeat.updated_date
              ) {
                return currentSeats; // 変更なしの場合は更新しない
              }

              // 固定配列をコピーし、該当する座席のみ更新
              const updatedSeats = [...currentSeats];
              updatedSeats[seatIndex] = newSeat;

              return updatedSeats; // ソートしない！順序を絶対に保持
            });
          } else if (payload.eventType === "DELETE") {
            const oldSeat = payload.old as Seat;
            const seatIndex = oldSeat.id - 1;

            if (seatIndex >= 0 && seatIndex < 8) {
              setSeats((currentSeats) => {
                const updatedSeats = [...currentSeats];
                updatedSeats[seatIndex] = {
                  id: oldSeat.id,
                  name: null,
                  is_occupied: false,
                  updated_date: new Date().toTimeString().substring(0, 5),
                };
                return updatedSeats; // ソートしない！順序を絶対に保持
              });
            }
          }
        }
      )
      .subscribe();

    // リアルタイムサブスクリプション（密度）
    const densitySubscription = supabase
      .channel("density-optimized")
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
            if (newSettings?.key === "density") {
              setDensityValue(newSettings.value);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(seatsSubscription);
      supabase.removeChannel(densitySubscription);
    };
  }, [createEmptySeats]);

  return {
    seats,
    densityValue,
    loading,
    error,
    occupySeat,
    releaseSeat,
    updateName,
    updateDensity,
  };
}
