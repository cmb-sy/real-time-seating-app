import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";
import { HeaderNav } from "@/components/ui/header-nav";

export const metadata: Metadata = {
  title: "リアルタイム座席管理アプリ",
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
        <AuthProvider>
          <div className="relative min-h-screen">
            <HeaderNav />
            <main className="pt-16">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
