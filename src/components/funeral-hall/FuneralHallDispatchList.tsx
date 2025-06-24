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

function fetchDispatchList(memberId: string) {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          managerName: "홍길동",
          dispatchDate: "2024-06-01T10:00:00",
          address: "서울시 강남구 테헤란로 123",
          familyPhone: "010-1234-5678",
          managerPhone: "010-9999-8888",
          emergencyPhone: "010-8765-4321",
        },
        {
          id: 2,
          managerName: "이영희",
          dispatchDate: "2024-04-01T15:30:00",
          address: "서울시 서초구 서초대로 456",
          familyPhone: "010-2222-3333",
          managerPhone: "010-7777-6666",
          emergencyPhone: "010-4444-5555",
        },
      ]);
    }, 1000);
  });
}

function isExpired(dateStr: string) {
  const now = new Date();
  const base = new Date(dateStr);
  const diff = now.getTime() - base.getTime();
  return diff > 1000 * 60 * 60 * 24 * 30; // 30일
}

export default function FuneralHallDispatchList({
  memberId,
}: {
  memberId: string;
}) {
  const [list, setList] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    // TODO: 실제 API 연동 fetchDispatchList(memberId)
    fetchDispatchList(memberId).then((data) => {
      setList(data);
      setLoading(false);
    });
  }, [memberId]);

  if (loading) return <CompanyMemberListSkeleton />;

  return (
    <div className="space-y-2">
      {list && list.length > 0 ? (
        list.map((item) => {
          const expired = isExpired(item.dispatchDate);
          return (
            <div
              key={item.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div className="flex gap-8 items-center flex-1">
                <div className="font-semibold">{item.managerName}</div>
                <div>{item.dispatchDate.replace("T", " ")}</div>
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
                    <DialogTitle>출동 상세 정보</DialogTitle>
                    <DialogDescription>
                      출동 요청 시각: {item.dispatchDate.replace("T", " ")}
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
                        item.familyPhone
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">팀장 연락처: </span>
                      {item.managerPhone}
                    </div>
                    <div>
                      <span className="font-semibold">비상 연락처: </span>
                      {expired ? (
                        <span className="text-gray-400">
                          저장기간 만료로 삭제됨
                        </span>
                      ) : (
                        item.emergencyPhone
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
