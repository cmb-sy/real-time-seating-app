"use client";

import { useState } from "react";
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

export function NavMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Menu className="h-6 w-6" />
          <span className="sr-only">メニューを開く</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-72 sm:w-80">
        <SheetHeader className="mb-6">
          <SheetTitle>メニュー</SheetTitle>
        </SheetHeader>
        <nav className="space-y-2">
          <Link href="/about" onClick={() => setOpen(false)}>
            <Button
              variant="ghost"
              className="w-full justify-start text-left"
              size="lg"
            >
              <span>当サービスについて</span>
            </Button>
          </Link>

          <Link href="/future-develop" onClick={() => setOpen(false)}>
            <Button
              variant="ghost"
              className="w-full justify-start text-left"
              size="lg"
            >
              <span>今後の実装予定</span>
            </Button>
          </Link>
          <Link href="/contact" onClick={() => setOpen(false)}>
            <Button
              variant="ghost"
              className="w-full justify-start text-left"
              size="lg"
            >
              <span>機能改善のご要望(まだ使えないです)</span>
            </Button>
          </Link>
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
