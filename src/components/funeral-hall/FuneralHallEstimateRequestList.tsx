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
import { estimateAPI } from "@/lib/api";

export default function FuneralHallEstimateRequestList({
  memberId,
}: {
  memberId: string;
}) {
  const [list, setList] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    estimateAPI
      .getEstimateRequestList(memberId)
      .then((response) => {
        // console.log("Fetched estimate requests:", response);
        setList(response.data); // Access the data array
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching estimate request list:", error);
        setLoading(false);
      });
  }, [memberId]);

  if (loading) return <CompanyMemberListSkeleton />;

  return (
    <div className="space-y-2">
      {list && list.length > 0 ? (
        list.map((item, index) => (
          <div
            key={index}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div className="flex gap-8 items-center flex-1">
              <div className="font-semibold">{item.managerForm.chiefMournerName}</div>
              <div>{item.bidSubmittedAt}</div>
            </div>
            <Dialog
              open={openId === index}
              onOpenChange={(open) => setOpenId(open ? index : null)}
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
                    신청일: {item.bidSubmittedAt}
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-2">
                  <div>
                    <span className="font-semibold">상주 이름: </span>
                    {item.managerForm.chiefMournerName}
                  </div>
                  <div>
                    <span className="font-semibold">상태: </span>
                    {item.bidStatus}
                  </div>
                  <div>
                    <span className="font-semibold">신청 ID: </span>
                    {item.managerFormBidId}
                  </div>
                  <div>
                    <span className="font-semibold">생성일: </span>
                    {item.managerFormCreatedAt}
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
