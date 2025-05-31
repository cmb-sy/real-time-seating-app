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

interface Seat {
  id: number;
  name: string | null;
  isOccupied: boolean;
}

export default function SeatManagement() {
  // クライアントサイドレンダリングのみを保証する
  const [isClient, setIsClient] = useState(false);

  // 6×2の席を初期化（12席）
  const [seats, setSeats] = useState<Seat[]>(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: null,
      isOccupied: false,
    }))
  );

  const [editingSeat, setEditingSeat] = useState<number | null>(null);
  const [inputName, setInputName] = useState("");

  const [confirmingSeat, setConfirmingSeat] = useState<number | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [densityValue, setDensityValue] = useState<number>(60);

  // クライアントサイドレンダリングのみを行うようにする
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSeatClick = (seatId: number) => {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat) return;

    if (seat.isOccupied) {
      // 着席中の場合は確認ダイアログを表示
      setConfirmingSeat(seatId);
      setIsConfirmDialogOpen(true);
    } else {
      // 空席の場合は編集モードに切り替え
      setEditingSeat(seatId);
      setInputName("");
    }
  };

  const handleNameConfirm = (seatId: number) => {
    if (!inputName.trim()) {
      setEditingSeat(null);
      return;
    }

    setSeats((prev) =>
      prev.map((s) =>
        s.id === seatId ? { ...s, name: inputName.trim(), isOccupied: true } : s
      )
    );

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

  const handleConfirmLeave = () => {
    if (confirmingSeat) {
      setSeats((prev) =>
        prev.map((s) =>
          s.id === confirmingSeat ? { ...s, name: null, isOccupied: false } : s
        )
      );
    }
    setIsConfirmDialogOpen(false);
    setConfirmingSeat(null);
  };

  const occupiedCount = seats.filter((seat) => seat.isOccupied).length;

  // クライアントサイドでのみレンダリングを行う
  if (!isClient) {
    return <div className="min-h-screen p-4 bg-white"></div>;
  }

  return (
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
              onChange={(e) => setDensityValue(Number(e.target.value))}
              className="w-16 text-center text-sm"
            />
            <span className="text-sm ml-1">%</span>
          </div>
        </div>

        {/* 右上：タイトルとステータス */}
        <div className="text-right">
          <div className="text-sm text-gray-600">
            21:00に座席状況はリセットされます
          </div>
          <div className="text-sm text-gray-600 bold">
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
                    variant={seat.isOccupied ? "default" : "outline"}
                    className={`
                      h-24 w-full flex flex-col items-center justify-center p-2
                      ${
                        seat.isOccupied
                          ? "bg-blue-500 hover:bg-blue-600 text-white"
                          : "hover:bg-gray-100"
                      }
                      transition-all duration-200
                    `}
                    onClick={() => handleSeatClick(seat.id)}
                  >
                    <div className="font-medium text-xs mb-1">席{seat.id}</div>
                    <div className="flex items-center justify-center mb-1">
                      {seat.isOccupied ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <UserX className="h-4 w-4" />
                      )}
                    </div>
                    {seat.isOccupied && seat.name && (
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
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
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
  );
}
