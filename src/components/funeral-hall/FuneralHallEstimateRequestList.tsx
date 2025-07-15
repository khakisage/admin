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
        console.log("Fetched estimate requests:", response);
        setList(response.data); // Access the data array
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching estimate request list:", error);
        setLoading(false);
      });
  }, [memberId]);

  if (loading) return <CompanyMemberListSkeleton />;

  const bidStatusLabels = {
    pending: '상조팀장이 견적 신청, 장례식장 응답 대기 중',
    bid_submitted: '장례식장이 입찰 제출',
    bid_selected: '상조팀장이 입찰 선택 및 출동 신청',
    bid_progress: '장례식장 + 상조팀장 출동요청 및 출동 승인 후 거래 진행중 상태',
    deceased_arrived: '고인 안치 완료',
    transaction_completed: '거래 완료',
    rejected: '거절/취소',
    expired: '만료',
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    bid_submitted: 'bg-blue-100 text-blue-700',
    bid_selected: 'bg-green-100 text-green-700',
    bid_progress: 'bg-orange-100 text-orange-700',
    deceased_arrived: 'bg-purple-100 text-purple-700',
    transaction_completed: 'bg-black text-white',
    rejected: 'bg-red-100 text-red-700',
    expired: 'bg-gray-100 text-gray-700',
  };

  return (
    <div className="space-y-2">
      {list && list.length > 0 ? (
        list.map((item, index) => (
          <div
            key={index}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div className="flex gap-8 items-center flex-1">
            <div>
                {new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(item.managerFormCreatedAt))}
              </div>
              <div className="font-semibold">상주명: {item.managerForm.chiefMournerName}</div>
              <div className="font-semibold">홀명: {item.funeralHallName}</div>
              <div><div className={`px-3 py-1 rounded-full ${statusColors[item.bidStatus] || 'bg-gray-100 text-gray-700'}`}>
  {bidStatusLabels[item.bidStatus] || 'Unknown Status'}
</div></div>
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
                    <span className="font-semibold">상주명: </span>
                    {item.managerForm.chiefMournerName}
                  </div>
                  <div>
                    <span className="font-semibold">상태: </span>
                    {
                      bidStatusLabels[item.bidStatus as keyof typeof bidStatusLabels] || 'Unknown Status'
                    }
                  </div>
                  <div>
                    <span className="font-semibold">홀명: </span>
                    {item.funeralHallName}
                  </div>
                  <div>
                    <span className="font-semibold">할인율: </span>
                    {item.discount}%
                  </div>
                  <div>
                    <span className="font-semibold">신청일: </span>
                    {new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(item.managerFormCreatedAt))}
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
