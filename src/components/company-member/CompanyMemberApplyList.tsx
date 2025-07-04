"use client";
import { useEffect, useState } from "react";
import CompanyMemberListSkeleton from "./CompanyMemberListSkeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

function fetchApplyList(memberId: string) {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          date: "2024-05-10",
          desc: "출동 신청 - 장례식장 A",
          status: "완료",
          chiefName: "홍길동",
          deceasedName: "김철수",
          chiefPhone: "010-1234-5678",
          emergencyPhone: "010-8765-4321",
        },
        {
          id: 2,
          date: "2024-04-01",
          desc: "출동 신청 - 장례식장 B",
          status: "취소",
          chiefName: "이영희",
          deceasedName: "박민수",
          chiefPhone: "010-2222-3333",
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

export default function CompanyMemberApplyList({
  memberId,
}: {
  memberId: string;
}) {
  const [list, setList] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    // TODO: 실제 API 연동 fetchApplyList(memberId)
    fetchApplyList(memberId).then((data) => {
      setList(data);
      setLoading(false);
    });
  }, [memberId]);

  if (loading) return <CompanyMemberListSkeleton />;

  return (
    <div className="space-y-2">
      {list && list.length > 0 ? (
        list.map((item) => {
          const expired = isExpired(item.date);
          return (
            <div
              key={item.id}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div className="flex gap-8 items-center flex-1">
                <div>{item.date}</div>
                <div>{item.desc}</div>
                <Badge
                  variant={item.status === "완료" ? "default" : "secondary"}
                >
                  {item.status}
                </Badge>
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
                    <DialogTitle>출동 신청 상세 정보</DialogTitle>
                    <DialogDescription>신청일: {item.date}</DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 space-y-2">
                    <div>
                      <span className="font-semibold">상주 이름: </span>
                      {item.chiefName}
                    </div>
                    <div>
                      <span className="font-semibold">고인 이름: </span>
                      {item.deceasedName}
                    </div>
                    <div>
                      <span className="font-semibold">상주 전화번호: </span>
                      {expired ? (
                        <span className="text-gray-400">
                          저장기간 만료로 삭제됨
                        </span>
                      ) : (
                        item.chiefPhone
                      )}
                    </div>
                    <div>
                      <span className="font-semibold">비상 전화번호: </span>
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
