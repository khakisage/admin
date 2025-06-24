"use client";
import { useEffect, useState } from "react";
import CompanyMemberListSkeleton from "./CompanyMemberListSkeleton";

// 더미 fetch 함수 (실제 API 연동시 대체)
function fetchCashChargeList(memberId: string) {
  return new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, date: "2024-06-01", amount: 100000, status: "완료" },
        { id: 2, date: "2024-05-20", amount: 50000, status: "완료" },
      ]);
    }, 1000);
  });
}

export default function CompanyMemberCashChargeList({
  memberId,
}: {
  memberId: string;
}) {
  const [list, setList] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 실제 API 연동 fetchCashChargeList(memberId)
    fetchCashChargeList(memberId).then((data) => {
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
