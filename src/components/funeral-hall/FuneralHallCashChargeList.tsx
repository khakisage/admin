"use client";
import { useEffect, useState } from "react";
import CompanyMemberListSkeleton from "@/components/company-member/CompanyMemberListSkeleton";
import { cashAPI } from "@/lib/api";

export default function FuneralHallCashChargeList({
  memberId,
}: {
  memberId: string;
}) {
  const [list, setList] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cashAPI
      .getManagerCashChargeHistoryById(memberId, "funeral")
      .then((response) => {
        console.log("🚀 ~ cashAPI.getManagerCashChargeHistoryById ~ data:", response.data);
        // Filter for transactionType "earn_cash"
        const filteredData = response.data.filter(
          (item: any) => item.transactionType === "earn_cash"
        );
        setList(filteredData);
        setLoading(false);
      })
      .catch((error) => {
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
            key={item.funeralCashHistoryId}
            className="border rounded p-4 flex justify-between items-center"
          >
            <div>{new Date(item.createdAt).toLocaleDateString()}</div>
            <div>충전금액: {item.funeralCashAmount.toLocaleString()}원</div>
            <div>{item.status === "completed" ? "완료" : "처리중"}</div>
            <div>잔액: {item.funeralCashBalanceAfter.toLocaleString()}원</div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-400 py-8">내역이 없습니다.</div>
      )}
    </div>
  );
}
