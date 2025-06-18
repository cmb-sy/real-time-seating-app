"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sparkles, Zap } from "lucide-react";
import { SeatGrid } from "@/components/seat-grid";
import { SeatDialog } from "@/components/seat-dialog";

import { useSeatsOptimized } from "@/hooks/use-seats-optimized";
import { useConfetti } from "@/hooks/use-confetti";

export default function SeatManagement() {
  const [mounted, setMounted] = useState(false);

  // 最適化されたフックを使用
  const {
    seats,
    loading,
    densityValue,
    occupySeat,
    releaseSeat,
    updateDensity,
    updateName,
  } = useSeatsOptimized();

  const { triggerConfetti } = useConfetti();

  // 状態管理
  const [editingSeat, setEditingSeat] = useState<number | null>(null);
  const [inputName, setInputName] = useState("");
  const [confirmingSeat, setConfirmingSeat] = useState<number | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isDialogEditing, setIsDialogEditing] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 座席クリック処理
  const handleSeatClick = useCallback(
    (seatId: number) => {
      const seat = seats.find((s) => s.id === seatId);
      if (!seat) return;

      if (seat.is_occupied) {
        // 着席中の場合はダイアログを表示
        setConfirmingSeat(seatId);
        setIsConfirmDialogOpen(true);
        setIsDialogEditing(false);
      } else {
        // 空席の場合は直接編集モード
        setEditingSeat(seatId);
        setInputName("");
      }
    },
    [seats]
  );

  // 名前確定処理
  const handleNameConfirm = useCallback(
    async (seatId: number) => {
      if (!inputName.trim()) {
        setEditingSeat(null);
        return;
      }

      const seat = seats.find((s) => s.id === seatId);
      if (!seat) return;

      try {
        if (seat.is_occupied || isDialogEditing) {
          // 名前の更新のみ
          await updateName(seatId, inputName.trim());
        } else {
          // 新規着席
          await occupySeat(seatId, inputName.trim());
          // 着席成功時にクラッカーアニメーション
          triggerConfetti(`seat-${seatId}`);
        }
      } catch (error) {
        console.error("座席操作エラー:", error);
      } finally {
        setEditingSeat(null);
        setInputName("");
        setIsDialogEditing(false);
      }
    },
    [inputName, seats, isDialogEditing, updateName, occupySeat, triggerConfetti]
  );

  // キーボード操作
  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent, seatId: number) => {
      if (e.key === "Enter") {
        handleNameConfirm(seatId);
      } else if (e.key === "Escape") {
        setEditingSeat(null);
        setInputName("");
      }
    },
    [handleNameConfirm]
  );

  // ダイアログ操作
  const handleStartEdit = useCallback(() => {
    const seat = seats.find((s) => s.id === confirmingSeat);
    if (seat) {
      setIsDialogEditing(true);
      setInputName(seat.name || "");
    }
  }, [seats, confirmingSeat]);

  const handleConfirmEdit = useCallback(() => {
    if (confirmingSeat) {
      handleNameConfirm(confirmingSeat);
    }
  }, [confirmingSeat, handleNameConfirm]);

  const handleCancelEdit = useCallback(() => {
    setIsDialogEditing(false);
    setInputName("");
  }, []);

  const handleLeave = useCallback(async () => {
    if (confirmingSeat) {
      try {
        await releaseSeat(confirmingSeat);
      } catch (error) {
        console.error("退席処理エラー:", error);
      }
    }
  }, [confirmingSeat, releaseSeat]);

  const handleDialogKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && confirmingSeat) {
        handleConfirmEdit();
      }
    },
    [confirmingSeat, handleConfirmEdit]
  );

  // ローディング表示
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
          </div>
          <div className="text-xl font-semibold text-gray-700">
            座席情報を読み込み中...
          </div>
        </div>
      </div>
    );
  }

  if (!mounted) return null;

  const currentSeat = confirmingSeat
    ? seats.find((s) => s.id === confirmingSeat)
    : null;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 relative">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl" />
      </div>

      {/* メインコンテンツ - レスポンシブ中央配置 */}
      <div className="relative z-10 pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* 座席グリッド */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-6xl">
              <SeatGrid
                seats={seats}
                editingSeat={editingSeat}
                inputName={inputName}
                onSeatClick={handleSeatClick}
                onInputChange={setInputName}
                onInputKeyDown={handleKeyPress}
                onInputBlur={handleNameConfirm}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 座席操作ダイアログ */}
      <SeatDialog
        isOpen={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        seatId={confirmingSeat}
        seatName={currentSeat?.name || null}
        isEditing={isDialogEditing}
        inputName={inputName}
        onInputChange={setInputName}
        onStartEdit={handleStartEdit}
        onConfirmEdit={handleConfirmEdit}
        onCancelEdit={handleCancelEdit}
        onLeave={handleLeave}
        onInputKeyDown={handleDialogKeyDown}
      />
    </div>
  );
}
