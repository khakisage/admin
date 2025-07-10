"use client";
import { useEffect, useState } from "react";
import CompanyMemberListSkeleton from "./CompanyMemberListSkeleton";
import { cashAPI } from "@/lib/api"; // API 모듈 경로 확인
import { format } from "date-fns";
import { ko } from "date-fns/locale";

export default function CompanyMemberCashRefundRequestList({
  memberId,
  memberType,
}: {
  memberId: string;
  memberType: string;
}) {
  const [list, setList] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cashAPI.getRefundRequestByUserId(memberId, memberType).then((response) => {
      console.log("Fetched refund requests:", response.data.refundRequests); // 데이터 확인
      setList(response.data.refundRequests);
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching cash refund request list:", error);
      setLoading(false);
    });
  }, [memberId, memberType]);



  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return <span className="text-green-500">승인</span>;
      case "rejected":
        return <span className="text-red-500">거절</span>;
      case "pending":
        return <span className="text-yellow-500">대기중</span>;
      case "requested":
        return <span className="text-blue-500">요청</span>;
      default:
        return <span>{status}</span>;
    }
  };

  if (loading) return <CompanyMemberListSkeleton />;

// "approved"만 제외한 리스트
const filteredList = list?.filter(item => item.status !== "approved") ?? [];

  return (
    <div className="space-y-2">
      {filteredList && filteredList.length > 0 ? (
        filteredList.map((item) => (
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
                <div>{format(new Date(item.createdAt), "yyyy년 MM월 dd일 a h시 mm분", { locale: ko })}</div>
                <div>{item.manager.managerBankNumber}</div>
              </div>
              <div className="text-right">{getStatusLabel(item.status)}</div>
            </div>
            {/* <Menubar>
              <MenubarMenu>
                <MenubarTrigger asChild>
                  <button className="p-2 rounded hover:bg-gray-100">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </MenubarTrigger>
                <MenubarContent align="end">
                  <MenubarItem onClick={() => handleApprove(item.refundRequestId)}>
                    승인
                  </MenubarItem>
                  <MenubarItem onClick={() => handleReject(item.refundRequestId)}>
                    거절
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar> */}
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400 py-8">내역이 없습니다.</div>
      )}
    </div>
  );
}
