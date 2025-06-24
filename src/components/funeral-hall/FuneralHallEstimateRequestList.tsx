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

function fetchEstimateRequestList(memberId: string) {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          managerName: "홍길동",
          requestDate: "2024-06-01",
          chiefName: "김철수",
          mournerCount: 30,
          checkInDate: "2024-06-02",
          checkOutDate: "2024-06-04",
        },
        {
          id: 2,
          managerName: "이영희",
          requestDate: "2024-05-20",
          chiefName: "박민수",
          mournerCount: 20,
          checkInDate: "2024-05-21",
          checkOutDate: "2024-05-23",
        },
      ]);
    }, 1000);
  });
}

export default function FuneralHallEstimateRequestList({
  memberId,
}: {
  memberId: string;
}) {
  const [list, setList] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    // TODO: 실제 API 연동 fetchEstimateRequestList(memberId)
    fetchEstimateRequestList(memberId).then((data) => {
      setList(data);
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
