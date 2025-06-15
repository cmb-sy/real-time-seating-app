"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
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
  { href: "/", label: "座席表示" },
  { href: "/analytics", label: "統計分析" },
  { href: "/contact", label: "お問い合わせ" },
  { href: "/about", label: "サービス情報" },
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

    let statusIcon = "🔴";
    let statusText = "接続失敗";

    if (isConnected) {
      statusIcon = isLocal ? "🟢" : "🔵";
      statusText = isLocal ? "ローカル接続" : "本番接続";
    }

    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-600">
          {statusIcon} {statusText}
        </span>
        {toggleEndpoint && (
          <Button
            variant="outline"
            size="sm"
            onClick={toggleEndpoint}
            className="text-xs h-6 px-2 text-gray-600 border-gray-300 hover:bg-gray-50"
          >
            {isLocal ? "本番" : "ローカル"}
          </Button>
        )}
      </div>
    );
  };

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 right-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* ロゴ */}
        <Link
          href="/"
          className="font-semibold text-lg text-gray-800 hover:text-gray-600 transition-colors"
        >
          座席管理システム
        </Link>

        {/* PC用ナビゲーション */}
        <nav className="hidden md:flex items-center space-x-4">
          {MENU_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium px-3 py-1.5 rounded-md transition-all duration-200 ${
                isActive(item.href)
                  ? "bg-blue-50 text-blue-700 font-semibold"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {item.label}
            </Link>
          ))}
          {/* API接続ステータス */}
          <div className="ml-3 pl-3 border-l border-gray-200">
            {renderApiStatus()}
          </div>
        </nav>

        {/* モバイル用ハンバーガーメニュー */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">メニューを開く</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader className="mb-6">
                <SheetTitle>メニュー</SheetTitle>
              </SheetHeader>
              <nav className="space-y-2">
                {MENU_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={handleClose}
                    className="block"
                  >
                    <Button
                      variant="ghost"
                      className={`w-full justify-start text-left ${
                        isActive(item.href) ? "bg-accent" : ""
                      }`}
                      size="lg"
                    >
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </nav>
              {/* モバイル用API接続ステータス */}
              <div className="mt-6 px-4">{renderApiStatus()}</div>
              <div className="absolute bottom-4 left-6 right-6">
                <div className="text-xs text-gray-500 text-center">
                  © 2025 座席管理システム v1.0
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
