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
import { dispatchAPI } from "@/lib/api";
import { ko } from "date-fns/locale";
import { format } from "date-fns";

function isExpired(dateStr: string) {
  const now = new Date();
  const base = new Date(dateStr);
  const diff = now.getTime() - base.getTime();
  return diff > 1000 * 60 * 60 * 24 * 30; // 30일
}

export default function CompanyMemberApplyList({
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
    dispatchAPI
      .getDispatchRequestsByUser(memberId, memberType)
      .then((response) => {
        console.log("Fetched dispatch requests:", response.data);
        setList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching dispatch request list:", error);
        setLoading(false);
      });
  }, [memberId, memberType]);

  if (loading) return <CompanyMemberListSkeleton />;
  console.log('🚀 ~ CompanyMemberApplyList ~ list:', list)
  return (
    <div className="space-y-2">
      {list && list.length > 0 ? (
        list.map((item, index) => {
          const expired = isExpired(item.createdAt);
          return (
            <div
              key={index}
              className="border rounded p-4 flex justify-between items-center"
            >
              <div className="flex gap-8 items-center flex-1">
                <div>{format(new Date(item.createdAt), "yyyy년 MM월 dd일", { locale: ko })}</div>
                <div>{item.address}</div>
                <Badge
                  variant={item.isApproved === "completed" ? "default" : "secondary"}
                >
                  {item.isApproved}
                </Badge>
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
                    <DialogTitle>출동 신청 상세 정보</DialogTitle>
                    <DialogDescription>신청일: {format(new Date(item.createdAt), "yyyy년 MM월 dd일 a h시 mm분", { locale: ko })}</DialogDescription>
                  </DialogHeader>
                  <div className="mt-4 space-y-2">
                    <div>
                      <span className="font-semibold">주소: </span>
                      {item.address || "정보 없음"}
                    </div>
                    {/* <div>
                      <span className="font-semibold">고인 이름: </span>
                      {item.funeralId || "정보 없음"}
                    </div> */}
                    <div>
                      <span className="font-semibold">상조팀장 전화번호: </span>
                      {expired ? (
                        <span className="text-gray-400">
                          저장기간 만료로 삭제됨
                        </span>
                      ) : (
                        item.managerPhoneNumber || "정보 없음"
                      )}
                    </div>
                    {/* <div>
                      <span className="font-semibold">비상 전화번호: </span>
                      {expired ? (
                        <span className="text-gray-400">
                          저장기간 만료로 삭제됨
                        </span>
                      ) : (
                        item.emergencyPhoneNumber || "정보 없음"
                      )}
                    </div> */}
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
