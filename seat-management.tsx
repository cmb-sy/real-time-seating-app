"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

export default function SeatManagement() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  // リアルタイムの座席データを取得するカスタムフックを使用
  const {
    seats,
    loading,
    densityValue,
    occupySeat,
    releaseSeat,
    updateDensity,
    updateName,
  } = useSeats();
  const { triggerConfetti } = useConfetti();

  const [editingSeat, setEditingSeat] = useState<number | null>(null);
  const [inputName, setInputName] = useState("");

  const [confirmingSeat, setConfirmingSeat] = useState<number | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleSeatClick = (seatId: number) => {
    const seat = seats.find((s) => s.id === seatId);
    if (!seat) return;

    if (seat.is_occupied) {
      // 着席中の場合は操作ダイアログを表示
      setConfirmingSeat(seatId);
      setIsConfirmDialogOpen(true);
    } else {
      // 空席の場合は直接インライン編集モード
      setEditingSeat(seatId);
      setInputName("");
    }
  };

  const handleNameConfirm = async (seatId: number | null) => {
    if (!seatId || !inputName.trim()) {
      setEditingSeat(null);
      setIsConfirmDialogOpen(false);
      return;
    }

    const seat = seats.find((s) => s.id === seatId);
    if (!seat) return;

    // 名前編集中かどうかをチェック（操作ダイアログから編集中）
    const isEditing = editingSeat === confirmingSeat;

    if (seat.is_occupied || isEditing) {
      // 着席中または編集中の場合は名前の更新のみ
      await updateName(seatId, inputName.trim());
    } else {
      // 空席への新規着席の場合
      await occupySeat(seatId, inputName.trim());
      // クラッカーアニメーションを発火
      triggerConfetti(`seat-${seatId}`);
    }

    setEditingSeat(null);
    setInputName("");
    setIsConfirmDialogOpen(false);
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
    try {
      if (confirmingSeat !== null) {
        // 座席を解放
        await releaseSeat(confirmingSeat);
      } else {
        console.error("退席処理失敗: confirmingSeat が null です");
      }
    } catch (error) {
      console.error("退席処理エラー:", error);
    } finally {
      setIsConfirmDialogOpen(false);
      setConfirmingSeat(null);
    }
  };

  // 夕方の時間チェックをuseSeatsフックに移動（コンポーネント内での状態管理を減らす）

  // ローディング中はローディング表示
  if (loading) {
    return (
      <div className="min-h-screen p-4 bg-white flex items-center justify-center">
        <div className="text-lg">座席情報を読み込み中...</div>
      </div>
    );
  }

  // クライアントサイドでのレンダリングが準備できていない場合は何も表示しない
  if (!mounted) return null;

  return (
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

        {/* 右上：スペース確保（メニューはrootレイアウトに移動済み） */}
        <div></div>
      </div>

      {/* 中央エリア: 座席レイアウト - 縦横中央に配置 */}
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="w-full max-w-5xl bg-gray-50 p-8 rounded-xl border border-gray-200 shadow-sm">
          {/* 4×2のグリッドレイアウト - 席を大きく */}
          <div className="grid grid-cols-4 grid-rows-2 gap-10 mx-auto">
            {seats.map((seat) => (
              <div key={seat.id} className="relative">
                {!seat.is_occupied && editingSeat === seat.id ? (
                  <Input
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    onKeyDown={(e) => handleKeyPress(e, seat.id)}
                    onBlur={() => handleNameConfirm(seat.id)}
                    placeholder="名前"
                    className="h-40 text-center text-xl"
                    autoFocus
                  />
                ) : (
                  <Button
                    id={`seat-${seat.id}`}
                    variant={seat.is_occupied ? "default" : "outline"}
                    className={`
                        h-40 w-full flex flex-col items-center justify-center relative
                        ${
                          seat.is_occupied
                            ? "bg-blue-500 hover:bg-blue-600 text-white p-4 pb-8"
                            : "hover:bg-gray-100 border border-gray-300 p-4"
                        }
                        transition-all duration-150 rounded-lg shadow-sm
                      `}
                    onClick={() => handleSeatClick(seat.id)}
                  >
                    <div
                      className={`flex items-center justify-center ${
                        seat.is_occupied ? "mb-2" : ""
                      }`}
                      style={{
                        marginTop: seat.is_occupied ? "0" : "auto",
                        marginBottom: seat.is_occupied ? "0" : "auto",
                      }}
                    >
                      <span className="font-medium text-base mr-2">
                        席{seat.id}
                      </span>
                      {seat.is_occupied ? (
                        <User className="h-5 w-5" />
                      ) : (
                        <UserX className="h-5 w-5" />
                      )}
                    </div>
                    {seat.is_occupied && seat.name && (
                      <div
                        className="text-4xl font-medium w-full px-1 text-center break-words overflow-hidden mb-3"
                        style={{
                          maxHeight: "4rem",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          wordBreak: "break-word",
                        }}
                        title={seat.name}
                      >
                        {seat.name}
                      </div>
                    )}
                    {seat.is_occupied && seat.updated_date && (
                      <div className="text-xs text-center opacity-70 absolute bottom-2 w-full left-0">
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
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent aria-describedby="seat-operation-description">
          <DialogHeader>
            <DialogTitle>座席の操作</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {editingSeat === confirmingSeat ? (
              <>
                <p>席{confirmingSeat}の名前を編集</p>
                <Input
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && confirmingSeat !== null) {
                      handleNameConfirm(confirmingSeat);
                      setIsConfirmDialogOpen(false);
                    }
                  }}
                  placeholder="名前を入力"
                  className="text-lg"
                  autoFocus
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingSeat(null);
                      setInputName("");
                      setIsConfirmDialogOpen(false);
                    }}
                  >
                    キャンセル
                  </Button>
                  <Button
                    onClick={() => {
                      handleNameConfirm(confirmingSeat);
                      setIsConfirmDialogOpen(false);
                    }}
                  >
                    保存
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p>席{confirmingSeat}の操作を選択してください</p>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const seat = seats.find((s) => s.id === confirmingSeat);
                      if (seat) {
                        setEditingSeat(confirmingSeat);
                        setInputName(seat.name || "");
                      }
                    }}
                  >
                    名前を編集
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleConfirmLeave}
                    className="bg-red-50 hover:bg-red-100"
                  >
                    退席する
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsConfirmDialogOpen(false)}
                  >
                    キャンセル
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
