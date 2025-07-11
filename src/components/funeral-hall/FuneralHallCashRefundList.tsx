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

export default function FuneralHallCashRefundList({
  memberId,
  memberType,
}: {
  memberId: string;
  memberType: string;
}) {
  const [list, setList] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cashAPI.getApprovedRefundRequestsByUserId(memberId, "funeral").then((response) => {
      console.log("Fetched approved refund requests:", response.data.refundRequests); // Log the data
      setList(response.data.refundRequests);
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching approved refund request list:", error);
      setLoading(false);
    });
  }, [memberId, memberType]);

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="text-green-500">승인</span>;
      case "rejected":
        return <span className="text-red-500">거절</span>;
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
                  <MenubarItem onClick={() => alert(`Details for ${item.refundRequestId}`)}>
                    Details
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
