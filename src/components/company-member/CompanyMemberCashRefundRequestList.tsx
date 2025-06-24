"use client";
import { useEffect, useState } from "react";
import CompanyMemberListSkeleton from "./CompanyMemberListSkeleton";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import { MoreHorizontal } from "lucide-react";

function fetchCashRefundRequestList(memberId: string) {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, date: "2024-05-15", amount: 30000, status: "신청" },
        { id: 2, date: "2024-04-30", amount: 50000, status: "완료" },
      ]);
    }, 1000);
  });
}

export default function CompanyMemberCashRefundRequestList({
  memberId,
}: {
  memberId: string;
}) {
  const [list, setList] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 실제 API 연동 fetchCashRefundRequestList(memberId)
    fetchCashRefundRequestList(memberId).then((data) => {
      setList(data);
      setLoading(false);
    });
  }, [memberId]);

  const handleApprove = (id: number) => {
    alert(`승인: ${id}`);
    // TODO: 승인 API 연동
  };
  const handleReject = (id: number) => {
    alert(`거절: ${id}`);
    // TODO: 거절 API 연동
  };

  if (loading) return <CompanyMemberListSkeleton />;

  return (
    <div className="space-y-2">
      {list && list.length > 0 ? (
        list.map((item) => (
          <div
            key={item.id}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div className="flex gap-8 items-center flex-1">
              <div>{item.date}</div>
              <div>{item.amount.toLocaleString()}원</div>
              {/* 상태(status)는 UI에서 표시하지 않음 */}
            </div>
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <button className="p-2 rounded hover:bg-gray-100">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </MenubarTrigger>
                <MenubarContent align="end">
                  <MenubarItem onClick={() => handleApprove(item.id)}>
                    승인
                  </MenubarItem>
                  <MenubarItem onClick={() => handleReject(item.id)}>
                    거절
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400 py-8">내역이 없습니다.</div>
      )}
    </div>
  );
}
