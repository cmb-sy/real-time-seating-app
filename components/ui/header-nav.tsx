"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

// メニュー項目を定数として定義
const MENU_ITEMS = [
  { href: "/", label: "座席表示", icon: "🪑" },
  { href: "/analytics", label: "統計分析", icon: "📊" },
  { href: "/about", label: "サービス情報", icon: "ℹ️" },
  { href: "/thank-you", label: "ありがとう", icon: "🙏" },
  { href: "/contact", label: "お問い合わせ", icon: "📧" },
];

type ApiStatus = {
  isConnected: boolean;
  isLocal: boolean;
  toggleEndpoint?: () => void;
};

interface HeaderNavProps {
  apiStatus?: ApiStatus;
}

export function HeaderNav({ apiStatus }: HeaderNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // メニューを閉じる関数をメモ化
  const handleClose = useCallback(() => setOpen(false), []);

  // 現在のパスがアクティブかどうかを判定する関数
  const isActive = (path: string) => pathname === path;

  // API接続ステータスを表示（開発環境のみ）
  const renderApiStatus = () => {
    // 本番環境では表示しない
    if (process.env.NODE_ENV === "production") return null;
    if (!apiStatus) return null;

    const { isConnected, isLocal, toggleEndpoint } = apiStatus;

    let statusColor = "text-red-500";
    let statusText = "接続失敗";

    if (isConnected) {
      statusColor = isLocal ? "text-green-500" : "text-blue-500";
      statusText = isLocal ? "ローカル" : "本番";
    }

    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${statusColor.replace(
            "text-",
            "bg-"
          )}`}
        />
        <span className={`text-xs font-medium ${statusColor}`}>
          {statusText}
        </span>
        {toggleEndpoint && (
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleEndpoint}
            className="text-xs h-6 px-2 hover:bg-gray-100"
          >
            切替
          </Button>
        )}
      </div>
    );
  };

  return (
    <>
      {/* メインヘッダー */}
      <header className="w-full bg-gradient-to-r from-slate-50 to-blue-50 shadow-lg fixed top-0 left-0 right-0 z-50 border-b border-slate-200/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* 左側: ブランドロゴ */}
            <div className="flex items-center space-x-3">
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-slate-800">
                  座席管理システム
                </h1>
                <div className="flex items-center text-xs text-slate-500 mt-0.5">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date().toLocaleDateString("ja-JP", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            </div>

            {/* 中央: メインナビゲーション（PC用） */}
            <nav className="hidden lg:flex items-center space-x-1">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "bg-white text-blue-600 shadow-md ring-1 ring-blue-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span className="text-sm whitespace-nowrap">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>

            {/* 右側: ユーティリティ */}
            <div className="flex items-center space-x-3">
              {/* API接続ステータス */}
              <div className="hidden lg:block">{renderApiStatus()}</div>

              {/* モバイル用ハンバーガーメニュー */}
              <div className="lg:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-xl hover:bg-white/60"
                    >
                      <Menu className="h-5 w-5" />
                      <span className="sr-only">メニューを開く</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-80 bg-gradient-to-b from-slate-50 to-white"
                  >
                    <SheetHeader className="mb-8">
                      <SheetTitle className="text-left text-xl font-bold text-slate-800">
                        メニュー
                      </SheetTitle>
                    </SheetHeader>

                    {/* モバイル用ナビゲーション */}
                    <nav className="space-y-2">
                      {MENU_ITEMS.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={handleClose}
                          className="block"
                        >
                          <div
                            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                              isActive(item.href)
                                ? "bg-blue-50 text-blue-600 border border-blue-100"
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-medium">{item.label}</span>
                          </div>
                        </Link>
                      ))}
                    </nav>

                    {/* モバイル用API接続ステータス */}
                    <div className="mt-6 p-4 bg-white rounded-xl border border-slate-200">
                      {renderApiStatus()}
                    </div>

                    {/* フッター */}
                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="text-xs text-slate-400 text-center">
                        © 2025 座席管理システム v2.0
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="h-8" />
    </>
  );
}
