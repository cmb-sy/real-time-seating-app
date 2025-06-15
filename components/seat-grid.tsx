"use client";

import React, { memo, useCallback } from "react";
import { User, UserX, Sparkles, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Seat {
  id: number;
  name: string | null;
  is_occupied: boolean;
  updated_date?: string;
}

interface SeatGridProps {
  seats: Seat[];
  editingSeat: number | null;
  inputName: string;
  onSeatClick: (seatId: number) => void;
  onInputChange: (value: string) => void;
  onInputKeyDown: (e: React.KeyboardEvent, seatId: number) => void;
  onInputBlur: (seatId: number) => void;
}

// 個別座席コンポーネント - 完全に固定化
const SeatButton = memo(
  ({
    seat,
    isEditing,
    inputName,
    onSeatClick,
    onInputChange,
    onInputKeyDown,
    onInputBlur,
  }: {
    seat: Seat;
    isEditing: boolean;
    inputName: string;
    onSeatClick: (seatId: number) => void;
    onInputChange: (value: string) => void;
    onInputKeyDown: (e: React.KeyboardEvent, seatId: number) => void;
    onInputBlur: (seatId: number) => void;
  }) => {
    const handleClick = useCallback(
      () => onSeatClick(seat.id),
      [onSeatClick, seat.id]
    );
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => onInputKeyDown(e, seat.id),
      [onInputKeyDown, seat.id]
    );
    const handleBlur = useCallback(
      () => onInputBlur(seat.id),
      [onInputBlur, seat.id]
    );

    // 編集モード
    if (!seat.is_occupied && isEditing) {
      return (
        <div className="relative h-44 w-full">
          <div className="h-full w-full bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-blue-300 rounded-2xl shadow-lg flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* 背景装飾 */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-2xl" />
            <div className="absolute top-2 right-2">
              <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
            </div>

            {/* 座席番号 */}
            <div className="flex items-center gap-2 mb-3 z-10">
              <span className="text-lg font-bold text-gray-700">
                席{seat.id}
              </span>
              <UserX className="h-5 w-5 text-gray-500" />
            </div>

            {/* 入力フィールド */}
            <div className="w-full z-10">
              <Input
                value={inputName}
                onChange={(e) => onInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder="お名前を入力"
                className="text-center text-xl font-medium border-0 bg-white/80 backdrop-blur-sm rounded-xl shadow-inner focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all duration-200 h-12"
                autoFocus
              />
            </div>

            {/* ヒントテキスト */}
            <p className="text-xs text-gray-500 mt-1 z-10">
              Enterで確定 / Escでキャンセル
            </p>
          </div>
        </div>
      );
    }

    // 通常の座席表示 - 完全に固定化
    return (
      <div className="relative h-44 w-full">
        <Button
          id={`seat-${seat.id}`}
          onClick={handleClick}
          className={`
          h-full w-full p-0 border-0 rounded-2xl shadow-lg transition-colors duration-200 relative overflow-hidden
          ${
            seat.is_occupied
              ? "bg-gradient-to-br from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white shadow-blue-200"
              : "bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 shadow-gray-200 border border-gray-200"
          }
        `}
        >
          {/* 背景装飾 */}
          <div
            className={`absolute inset-0 ${
              seat.is_occupied
                ? "bg-gradient-to-br from-white/20 to-transparent"
                : "bg-gradient-to-br from-white/50 to-transparent"
            } rounded-2xl`}
          />

          {/* 座席内容 - レイヤー分けした固定レイアウト */}
          <div className="relative z-10 h-full w-full">
            {/* 座席番号とアイコン - 上部固定 */}
            <div className="absolute top-3 left-0 right-0 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <span className="text-base font-bold">席{seat.id}</span>
                {seat.is_occupied ? (
                  <User className="h-4 w-4" />
                ) : (
                  <UserX className="h-4 w-4" />
                )}
              </div>
            </div>

            {/* 名前表示エリア - 完全中央配置（上下のマージンを考慮） */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ marginTop: "2.5rem", marginBottom: "2.5rem" }}
            >
              <div className="w-full px-3 flex items-center justify-center">
                {seat.is_occupied && seat.name ? (
                  <div className="text-center w-full">
                    <div
                      className="text-xl font-bold leading-tight break-words text-center"
                      style={{
                        maxHeight: "3.5rem",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        wordBreak: "break-word",
                      }}
                      title={seat.name}
                    >
                      {seat.name}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            {/* 更新時間 - 下部固定 */}
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center">
              {seat.is_occupied && seat.updated_date && (
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{seat.updated_date.substring(0, 5)}</span>
                </div>
              )}
            </div>
          </div>

          {/* ホバー効果 */}
          <div className="absolute inset-0 bg-white/0 hover:bg-white/10 transition-colors duration-200 rounded-2xl" />
        </Button>
      </div>
    );
  }
);

SeatButton.displayName = "SeatButton";

// メイン座席グリッドコンポーネント - 完全に固定化
export const SeatGrid = memo(
  ({
    seats,
    editingSeat,
    inputName,
    onSeatClick,
    onInputChange,
    onInputKeyDown,
    onInputBlur,
  }: SeatGridProps) => {
    // 座席を完全に固定位置で配置（1-8の順序を絶対に保証）
    // 常に8個の座席を表示し、データがない場合はデフォルト値を使用
    const fixedSeats = Array.from({ length: 8 }, (_, index) => {
      const seatId = index + 1;
      // seatsが8個未満の場合でも、インデックスベースで安全にアクセス
      const seat = seats[index];

      // 座席データが存在し、IDが一致する場合はそのまま使用
      if (seat && seat.id === seatId) {
        return seat;
      }

      // データがない場合やIDが一致しない場合はデフォルト値を返す
      return {
        id: seatId,
        name: null,
        is_occupied: false,
        updated_date: undefined,
      };
    });

    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        {/* 座席グリッドコンテナ */}
        <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-3xl shadow-xl border border-gray-200 max-w-6xl w-full p-8">
          {/* 座席グリッド - 完全に固定レイアウト、画面サイズに最適化 */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {fixedSeats.map((seat, index) => (
              <div
                key={`seat-${seat.id}`} // シンプルで一意なキー
                className="relative"
              >
                <SeatButton
                  seat={seat}
                  isEditing={editingSeat === seat.id}
                  inputName={inputName}
                  onSeatClick={onSeatClick}
                  onInputChange={onInputChange}
                  onInputKeyDown={onInputKeyDown}
                  onInputBlur={onInputBlur}
                />
              </div>
            ))}
          </div>

          {/* 入り口表示 - 座席の下側に配置 */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-200 border border-gray-300 rounded-full px-6 py-3 text-gray-600 font-medium shadow-sm">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
              <span>入り口側</span>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

SeatGrid.displayName = "SeatGrid";
