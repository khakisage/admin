"use client";
import { useEffect, useState } from "react";
import CompanyMemberListSkeleton from "@/components/company-member/CompanyMemberListSkeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { dispatchAPI } from "@/lib/api"; // Ensure the correct path to your API module

function isExpired(dateStr: string) {
  const now = new Date();
  const base = new Date(dateStr);
  const diff = now.getTime() - base.getTime();
  return diff > 1000 * 60 * 60 * 24 * 30; // 30일
}

export default function FuneralHallDispatchList({
  memberId,
  memberType,
}: {
  memberId: string;
  memberType: string;
}) {
  const [list, setList] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    // 실제 API 연동
    dispatchAPI.getDispatchRequestsByUser(memberId, "funeral").then((response) => {
      console.log("Fetched dispatch requests:", response.data); // Log the data
      setList(response.data);
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching dispatch request list:", error);
      setLoading(false);
    });
  }, [memberId, memberType]);

  if (loading) return <CompanyMemberListSkeleton />;

  return (
    <div className="space-y-2">
      {list && list.length > 0 ? (
        list.map((item) => {
          const expired = isExpired(item.createdAt); // createdAt 사용
          return (
            <div
              key={item.dispatchRequestId} // dispatchRequestId 사용
              className="border rounded p-4 flex justify-between items-center"
            >
              <div className="flex gap-8 items-center flex-1">
                <div className="font-semibold">{item.managerName}</div>
                <div>{item.createdAt ? item.createdAt.replace("T", " ") : "N/A"}</div>
              </div>
              <Dialog
                open={openId === item.dispatchRequestId}
                onOpenChange={(open) => setOpenId(open ? item.dispatchRequestId : null)}
              >
                <DialogTrigger asChild>
                  <button className="px-4 py-2 rounded bg-blue-50 hover:bg-blue-100 border text-blue-700 font-medium">
                    상세보기
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>출동 상세 정보</DialogTitle>
                    <DialogDescription>
                      출동 요청 시각: {item.createdAt ? item.createdAt.replace("T", " ") : "N/A"}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 space-y-2">
                    <div>
                      <span className="font-semibold">주소: </span>
                      {expired ? (
                        <span className="text-gray-400">
                          저장기간 만료로 삭제됨
                        </span>
                      ) : (
                        item.address
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">가족 연락처: </span>
                      {expired ? (
                        <span className="text-gray-400">
                          저장기간 만료로 삭제됨
                        </span>
                      ) : (
                        item.familyPhoneNumber
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">팀장 연락처: </span>
                      {item.managerPhoneNumber}
                    </div>
                    <div>
                      <span className="font-semibold">비상 연락처: </span>
                      {expired ? (
                        <span className="text-gray-400">
                          저장기간 만료로 삭제됨
                        </span>
                      ) : (
                        item.emergencyPhoneNumber
                      )}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-400 py-8">내역이 없습니다.</div>
      )}
    </div>
  );
}
