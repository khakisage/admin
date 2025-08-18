"use client";
import { useEffect, useState } from "react";
import CompanyMemberListSkeleton from "@/components/company-member/CompanyMemberListSkeleton";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import { MoreHorizontal } from "lucide-react";
import { cashAPI } from "@/lib/api"; // Ensure the correct path to your API module

export default function FuneralHallCashRefundRequestList({
  memberId,
  memberType,
}: {
  memberId: string;
  memberType: string;
}) {
  const [list, setList] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  // 환불 요청 내역 조회
  useEffect(() => {
    cashAPI
      .getRefundRequestByUserId(memberId, "funeral")
      .then((response) => {
        console.log("Fetched refund requests:", response.data.refundRequests); // Log the data
        setList(response.data.refundRequests);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cash refund request list:", error);
        setLoading(false);
      });
  }, [memberId, memberType]);

  const handleApprove = (id: number) => {
    alert(`승인: ${id}`);
    // TODO: Integrate approval API
  };
  const handleReject = (id: number) => {
    alert(`거절: ${id}`);
    // TODO: Integrate rejection API
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="text-green-500">승인</span>;
      case "rejected":
        return <span className="text-red-500">거절</span>;
      case "pending":
        return <span className="text-yellow-500">대기중</span>;
      default:
        return <span>{status}</span>;
    }
  };

  if (loading) return <CompanyMemberListSkeleton />;

  return (
    <div className="space-y-2">
      {list && list.length > 0 ? (
        list.map((item) => (
          <div
            key={item.refundRequestId}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex justify-between">
                <div className="font-bold">{item.manager.managerName}</div>
                <div>{item.manager.managerBankName}</div>
              </div>
              <div className="flex justify-between">
                <div>{item.manager.managerPhoneNumber}</div>
                <div>{item.refundAmount.toLocaleString()}원</div>
              </div>
              <div className="flex justify-between">
                <div>{item.updatedAt}</div>
                <div>{item.manager.managerBankNumber}</div>
              </div>
              <div className="text-right">{getStatusLabel(item.status)}</div>
            </div>
            <Menubar>
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <button className="p-2 rounded hover:bg-gray-100">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </MenubarTrigger>
                <MenubarContent align="end">
                  <MenubarItem
                    onClick={() => handleApprove(item.refundRequestId)}
                  >
                    승인
                  </MenubarItem>
                  <MenubarItem
                    onClick={() => handleReject(item.refundRequestId)}
                  >
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
