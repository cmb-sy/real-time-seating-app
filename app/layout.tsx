import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";
import { NavMenu } from "@/components/nav-menu";

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
            <div className="absolute top-4 right-4 z-10">
              <NavMenu />
            </div>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
