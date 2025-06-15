"use client";

import React, { memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, UserX, Edit3, LogOut, X } from "lucide-react";

interface SeatDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  seatId: number | null;
  seatName: string | null;
  isEditing: boolean;
  inputName: string;
  onInputChange: (value: string) => void;
  onStartEdit: () => void;
  onConfirmEdit: () => void;
  onCancelEdit: () => void;
  onLeave: () => void;
  onInputKeyDown: (e: React.KeyboardEvent) => void;
}

export const SeatDialog = memo(
  ({
    isOpen,
    onOpenChange,
    seatId,
    seatName,
    isEditing,
    inputName,
    onInputChange,
    onStartEdit,
    onConfirmEdit,
    onCancelEdit,
    onLeave,
    onInputKeyDown,
  }: SeatDialogProps) => {
    const handleClose = useCallback(() => {
      onCancelEdit();
      onOpenChange(false);
    }, [onCancelEdit, onOpenChange]);

    const handleConfirm = useCallback(() => {
      onConfirmEdit();
      onOpenChange(false);
    }, [onConfirmEdit, onOpenChange]);

    const handleLeave = useCallback(() => {
      onLeave();
      onOpenChange(false);
    }, [onLeave, onOpenChange]);

    if (!seatId) return null;

    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent
          className="sm:max-w-md bg-white/95 backdrop-blur-xl border-0 shadow-2xl rounded-3xl"
          aria-describedby="seat-dialog-description"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              席{seatId}の操作
            </DialogTitle>
            <DialogDescription
              id="seat-dialog-description"
              className="text-gray-500 mt-2"
            >
              座席の名前編集や退席などの操作ができます
            </DialogDescription>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* 編集モード */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 mb-4">
                    <Edit3 className="h-4 w-4 text-blue-600" />
                    <span className="text-blue-800 font-medium">
                      名前を編集中
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      value={inputName}
                      onChange={(e) => onInputChange(e.target.value)}
                      onKeyDown={onInputKeyDown}
                      placeholder="新しい名前を入力"
                      className="text-lg text-center border-2 border-blue-200 focus:border-blue-400 rounded-xl bg-blue-50/50 focus:bg-white transition-all duration-200"
                      autoFocus
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={onCancelEdit}
                      className="flex-1 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200"
                    >
                      <X className="h-4 w-4 mr-2" />
                      キャンセル
                    </Button>
                    <Button
                      onClick={handleConfirm}
                      disabled={!inputName.trim()}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Edit3 className="h-4 w-4 mr-2" />
                      保存
                    </Button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* メニューモード */}
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 bg-emerald-50 rounded-2xl px-6 py-4 mb-6">
                    <User className="h-6 w-6 text-emerald-600" />
                    <div className="text-left">
                      <div className="text-emerald-800 font-bold text-lg">
                        {seatName || "名前未設定"}
                      </div>
                      <div className="text-emerald-600 text-sm">着席中</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={onStartEdit}
                    className="w-full h-12 rounded-xl border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group"
                  >
                    <Edit3 className="h-5 w-5 mr-3 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-blue-700 font-medium">
                      名前を編集
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleLeave}
                    className="w-full h-12 rounded-xl border-2 border-red-200 hover:border-red-300 hover:bg-red-50 transition-all duration-200 group"
                  >
                    <LogOut className="h-5 w-5 mr-3 text-red-600 group-hover:scale-110 transition-transform duration-200" />
                    <span className="text-red-700 font-medium">退席する</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleClose}
                    className="w-full h-12 rounded-xl border-gray-200 hover:bg-gray-50 transition-all duration-200"
                  >
                    <X className="h-5 w-5 mr-3 text-gray-600" />
                    <span className="text-gray-700 font-medium">
                      キャンセル
                    </span>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    );
  }
);

SeatDialog.displayName = "SeatDialog";
