import type { Metadata } from "next";
import { Toaster } from "sonner";

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
    <div className="antialiased font-pretendard bg-gray-200">
      {children}
      <Toaster />
    </div>
  );
}
