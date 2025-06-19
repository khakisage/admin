import "../globals.css";
import { AdminNavigationMenu } from "@/components/common/AdminNavigationMenu";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-blue">
      <header className="w-full h-16 flex items-center justify-between px-6 bg-blue border-b border-blue-200">
        <div className="flex items-center">
          <h1 className="text-white text-xl font-bold">하늘애 관리자</h1>
        </div>
        <AdminNavigationMenu />
      </header>
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>
    </div>
  );
}
