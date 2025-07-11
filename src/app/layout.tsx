import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "하늘애",
  description: "하늘애 관리자 페이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased font-pretendard bg-gray-200">
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
