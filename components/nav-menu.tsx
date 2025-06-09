"use client";

import { useState, useCallback, memo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

// メニュー項目を定数として定義
const MENU_ITEMS = [
  { href: "/about", label: "当サービスについて" },
  { href: "/contact", label: "機能改善の要望・お問い合わせ" },
];

// メニューアイテムコンポーネントをメモ化
const MenuItem = memo(
  ({
    href,
    label,
    onClick,
  }: {
    href: string;
    label: string;
    onClick: () => void;
  }) => (
    <Link href={href} onClick={onClick}>
      <Button
        variant="ghost"
        className="w-full justify-start text-left"
        size="lg"
      >
        <span>{label}</span>
      </Button>
    </Link>
  )
);
MenuItem.displayName = "MenuItem";

export function NavMenu() {
  const [open, setOpen] = useState(false);

  // メニューを閉じる関数をメモ化
  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full bg-white/80 hover:bg-white shadow-sm"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">メニューを開く</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-72 sm:w-80">
        <SheetHeader className="mb-6">
          <SheetTitle>メニュー</SheetTitle>
        </SheetHeader>
        <nav className="space-y-2">
          {MENU_ITEMS.map((item) => (
            <MenuItem
              key={item.href}
              href={item.href}
              label={item.label}
              onClick={handleClose}
            />
          ))}
        </nav>
        <div className="absolute bottom-4 left-6 right-6">
          <div className="text-xs text-gray-500 text-center">
            © 2025 座席管理システム v1.0
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
