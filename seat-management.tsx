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
import { User, UserX } from "lucide-react";
import { useSeats } from "@/hooks/use-seats";

interface Seat {
  id: number;
  name: string | null;
  is_occupied: boolean;
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

  const occupiedCount = seats?.filter((seat) => seat.is_occupied)?.length || 0;

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
        <div className="flex justify-between mb-8">
          {/* 左上：社内密集度の入力エリア */}
          <div className="w-1/4">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">社内密集度:</span>
              <Input
                type="number"
                min="0"
                max="100"
                value={densityValue}
                onChange={(e) => updateDensity(Number(e.target.value))}
                className="w-16 text-center text-sm"
              />
              <span className="text-sm ml-1">%</span>
            </div>
          </div>

          {/* 右上：タイトルとステータス */}
          <div className="text-right">
            <div
              className={`text-sm ${
                isEveningTime ? "text-orange-600 font-medium" : "text-gray-600"
              }`}
            >
              21:00に座席状況と社内密集度は自動リセットされます
              {isEveningTime && " (リセット時間帯です)"}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              着席中: {occupiedCount}/12席
            </div>
          </div>
        </div>

        {/* 中央エリア: 座席レイアウト - 縦横中央に配置 */}
        <div className="flex items-center justify-center h-[calc(100vh-200px)]">
          <div className="w-full max-w-4xl">
            {/* 6×2のグリッドレイアウト - 席を大きく */}
            <div className="grid grid-cols-6 grid-rows-2 gap-6">
              {seats.map((seat) => (
                <div key={seat.id} className="relative">
                  {editingSeat === seat.id ? (
                    <Input
                      value={inputName}
                      onChange={(e) => setInputName(e.target.value)}
                      onKeyDown={(e) => handleKeyPress(e, seat.id)}
                      onBlur={() => handleNameConfirm(seat.id)}
                      placeholder="名前"
                      className="h-24 text-center text-sm"
                      autoFocus
                    />
                  ) : (
                    <Button
                      variant={seat.is_occupied ? "default" : "outline"}
                      className={`
                      h-24 w-full flex flex-col items-center justify-center p-2
                      ${
                        seat.is_occupied
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                      }
                      transition-all duration-200
                    `}
                      onClick={() => handleSeatClick(seat.id)}
                    >
                      <div className="font-medium text-xs mb-1">
                        席{seat.id}
                      </div>
                      <div className="flex items-center justify-center mb-1">
                        {seat.is_occupied ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <UserX className="h-4 w-4" />
                        )}
                      </div>
                      {seat.is_occupied && seat.name && (
                        <div className="text-sm w-full text-center break-all line-clamp-2">
                          {seat.name}
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              ))}
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
