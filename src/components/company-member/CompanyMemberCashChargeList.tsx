"use client";
import { useEffect, useState } from "react";
import CompanyMemberListSkeleton from "./CompanyMemberListSkeleton";
import { cashAPI } from "@/lib/api"; // API 모듈 경로 확인

export default function CompanyMemberCashChargeList({
  memberId,
  memberType,
}: {
  memberId: string;
  memberType: string;
}) {
  const [list, setList] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 실제 API 연동
    cashAPI.getManagerCashChargeHistoryById(memberId, "manager").then((data) => {
      setList(data);
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching cash charge list:", error);
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
            <div>{item.date}</div>
            <div>{item.amount.toLocaleString()}원</div>
            <div>{item.status}</div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400 py-8">내역이 없습니다.</div>
      )}
    </div>
  );
}
