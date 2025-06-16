import type { Metadata } from "next";
import "./globals.css";
import { HeaderNav } from "@/components/ui/header-nav";

export const metadata: Metadata = {
  title: "座席ミエール",
  description: "座席の予約とリアルタイム管理のためのアプリケーション",
  generator: "v0.dev",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="bg-white">
        <div className="relative min-h-screen">
          <HeaderNav />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
