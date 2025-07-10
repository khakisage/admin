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
import { estimateAPI } from "@/lib/api"; // Ensure the correct path to your API module

export default function FuneralHallEstimateRequestList({
  memberId,
}: {
  memberId: string;
}) {
  const [list, setList] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    // 실제 API 연동
    estimateAPI.getEstimateRequestList(memberId).then((data) => {
      console.log("Fetched estimate requests:", data); // Log the data
      setList(data);
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching estimate request list:", error);
      setLoading(false);
    });
  }, [memberId]);

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
              <div className="font-semibold">{item.managerName}</div>
              <div>{item.requestDate}</div>
            </div>
            <Dialog
              open={openId === item.id}
              onOpenChange={(open) => setOpenId(open ? item.id : null)}
            >
              <DialogTrigger asChild>
                <button className="px-4 py-2 rounded bg-blue-50 hover:bg-blue-100 border text-blue-700 font-medium">
                  상세보기
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>견적 신청 상세 정보</DialogTitle>
                  <DialogDescription>
                    신청일: {item.requestDate}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-2">
                  <div>
                    <span className="font-semibold">상주 이름: </span>
                    {item.chiefName}
                  </div>
                  <div>
                    <span className="font-semibold">조문객 수: </span>
                    {item.mournerCount}
                  </div>
                  <div>
                    <span className="font-semibold">입실일자: </span>
                    {item.checkInDate}
                  </div>
                  <div>
                    <span className="font-semibold">퇴실일자: </span>
                    {item.checkOutDate}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400 py-8">내역이 없습니다.</div>
      )}
    </div>
  );
}
