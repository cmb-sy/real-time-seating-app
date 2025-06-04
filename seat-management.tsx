"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { User, UserX, LayoutDashboard } from "lucide-react";
import { useSeats } from "@/hooks/use-seats";
import { useConfetti } from "@/hooks/use-confetti";
import { NavMenu } from "@/components/nav-menu";

interface Seat {
  id: number;
  name: string | null;
  is_occupied: boolean;
  updated_date?: string; // 更新時間のフィールド追加
}

// クライアントサイドでのみレンダリングするコンポーネントをラップする
function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <>{children}</>;
}

export default function SeatManagement() {
  // リアルタイムの座席データを取得するカスタムフックを使用
  const {
    seats,
    loading,
    densityValue,
    occupySeat,
    releaseSeat,
    updateDensity,
  } = useSeats();

  // クラッカーアニメーションのみ使用

  // クラッカーアニメーション
  const { triggerConfetti } = useConfetti();

  const [editingSeat, setEditingSeat] = useState<number | null>(null);
  const [inputName, setInputName] = useState("");

  const [confirmingSeat, setConfirmingSeat] = useState<number | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // 座席クリックの処理
  const handleSeatClick = (seatId: number) => {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat) return;

    if (seat.is_occupied) {
      // 着席中の場合は確認ダイアログを表示
      setConfirmingSeat(seatId);
      setIsConfirmDialogOpen(true);
    } else {
      // 空席の場合は編集モードに切り替え
      setEditingSeat(seatId);
      setInputName("");
    }
  };

  const handleNameConfirm = async (seatId: number) => {
    if (!inputName.trim()) {
      setEditingSeat(null);
      return;
    }

    // 座席を更新
    await occupySeat(seatId, inputName.trim());

    // クラッカーアニメーションを発火
    triggerConfetti(`seat-${seatId}`);

    setEditingSeat(null);
    setInputName("");
  };

  const handleEditCancel = () => {
    setEditingSeat(null);
    setInputName("");
  };

  const handleKeyPress = (e: React.KeyboardEvent, seatId: number) => {
    if (e.key === "Enter") {
      handleNameConfirm(seatId);
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  const handleConfirmLeave = async () => {
    if (confirmingSeat) {
      // 座席を解放
      await releaseSeat(confirmingSeat);
    }
    setIsConfirmDialogOpen(false);
    setConfirmingSeat(null);
  };

  // 現在時刻が21時以降かどうか
  const [isEveningTime, setIsEveningTime] = useState(false);

  // 現在時刻を確認
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      setIsEveningTime(now.getHours() >= 21);
    };

    checkTime();
    const timeInterval = setInterval(checkTime, 60000); // 1分ごとに確認

    return () => clearInterval(timeInterval);
  }, []);

  // ローディング中はローディング表示
  if (loading) {
    return (
      <div className="min-h-screen p-4 bg-white flex items-center justify-center">
        <div className="text-lg">座席情報を読み込み中...</div>
      </div>
    );
  }

  return (
    <ClientOnly>
      <div className="min-h-screen p-4 bg-white">
        {/* 上部エリア: 左右に分かれたヘッダー */}
        <div className="flex justify-between items-center mb-8">
          {/* 左上：日付と社内人口密度率 */}
          <div>
            {/* 日付表示 */}
            <div className="mb-3">
              <div className="text-sm font-medium text-gray-700">
                {new Date().toLocaleDateString("ja-JP", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
            </div>

            {/* 社内人口密度率 */}
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2 text-gray-700">
                社内人口密度率:
              </span>
              <Input
                type="number"
                min="0"
                max="100"
                value={densityValue}
                onChange={(e) => updateDensity(Number(e.target.value))}
                className="w-16 text-center text-sm"
              />
              <span className="text-sm ml-1 text-gray-700">%</span>
            </div>
          </div>

          {/* 右上：メニューボタンのみ */}
          <div>
            {/* メニューボタン */}
            <NavMenu />
          </div>
        </div>

        {/* 中央エリア: 座席レイアウト - 縦横中央に配置 */}
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="w-full max-w-5xl bg-gray-50 p-8 rounded-xl border border-gray-200 shadow-sm">
            {/* 4×2のグリッドレイアウト - 席を大きく */}
            <div className="grid grid-cols-4 grid-rows-2 gap-10 mx-auto">
              {seats.map((seat) => (
                <div key={seat.id} className="relative">
                  {editingSeat === seat.id ? (
                    <Input
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, seat.id)}
                      onBlur={() => handleNameConfirm(seat.id)}
                      placeholder="名前"
                      className="h-40 text-center text-lg"
                      autoFocus
                    />
                  ) : (
                    <Button
                      id={`seat-${seat.id}`}
                      variant={seat.is_occupied ? "default" : "outline"}
                      className={`
                      h-40 w-full flex flex-col items-center justify-center p-4
                      ${
                        seat.is_occupied
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                      }
                      transition-all duration-200 rounded-lg shadow-sm
                    `}
                      onClick={() => handleSeatClick(seat.id)}
                    >
                      <div className="font-medium text-base mb-2">
                        席{seat.id}
                      </div>
                      <div className="flex items-center justify-center mb-3">
                        {seat.is_occupied ? (
                          <User className="h-7 w-7" />
                        ) : (
                          <UserX className="h-7 w-7" />
                        )}
                      </div>
                      {seat.is_occupied && seat.name && (
                        <div
                          className="text-lg w-full text-center break-all line-clamp-2 cursor-pointer hover:underline"
                          onClick={(e) => {
                            e.stopPropagation(); // 親ボタンのクリックを止める
                            setEditingSeat(seat.id);
                            setInputName(seat.name || "");
                          }}
                          title="クリックして名前を編集"
                        >
                          {seat.name}
                        </div>
                      )}
                      {seat.updated_date && (
                        <div className="text-xs mt-2 text-center opacity-70">
                          {seat.updated_date.substring(0, 5)}
                          更新
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              ))}
            </div>
            {/* 入り口側の表示 - 画面下部に配置 */}
            <div className="mt-8 text-center">
              <div className="inline-block border border-gray-400 rounded px-8 py-2 text-gray-600 font-medium">
                入り口側
              </div>
            </div>
          </div>
        </div>

        {/* 退席確認ダイアログ */}
        <Dialog
          open={isConfirmDialogOpen}
          onOpenChange={setIsConfirmDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>退席確認</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p>席{confirmingSeat}から退席しますか？</p>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setIsConfirmDialogOpen(false)}
                >
                  キャンセル
                </Button>
                <Button variant="destructive" onClick={handleConfirmLeave}>
                  退席
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ClientOnly>
  );
}
