import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/providers";

export const metadata: Metadata = {
  title: "WarehouseGo — Hệ thống Quản lý Kho hàng",
  description: "WarehouseGo là hệ thống quản lý kho hàng nội bộ hiện đại, hỗ trợ nhập xuất hàng, báo cáo tồn kho và phân quyền theo vai trò.",
  keywords: ["warehouse", "kho hàng", "quản lý kho", "WarehouseGo"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
