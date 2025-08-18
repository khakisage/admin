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
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 캐시 충전 내역 조회
  useEffect(() => {
    cashAPI
      .getManagerCashChargeHistoryById(memberId, "funeral")
      .then((response) => {
        console.log(
          "🚀 ~ cashAPI.getManagerCashChargeHistoryById ~ data:",
          response.data
        );
        // Filter for transactionType "earn_cash"
        const filteredData = response.data.funeralCashHistory.filter(
          (item: any) => item.transactionType === "earn_cash"
        );

        // 최신 날짜순으로 정렬
        const sortedData = filteredData.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA; // 내림차순 (최신순)
        });

        setList(sortedData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching cash charge list:", error);
        setLoading(false);
      });
  }, [memberId]);

  // 거래 타입에 따른 텍스트 변환
  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case "earn_cash":
        return "캐시 충전";
      case "service_cash":
        return "서비스 사용";
      case "cancel_cash":
        return "캐시 취소";
      case "withdraw_cash":
        return "캐시 출금";
      default:
        return type;
    }
  };

  // 상태에 따른 스타일 및 텍스트
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "completed":
        return { text: "완료", className: "text-green-600 bg-green-100" };
      case "pending":
        return { text: "대기중", className: "text-yellow-600 bg-yellow-100" };
      case "cancelled":
        return { text: "취소", className: "text-red-600 bg-red-100" };
      default:
        return { text: status, className: "text-gray-600 bg-gray-100" };
    }
  };

  // ID 복사 함수
  const copyToClipboard = async (id: string, type: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(`${type}_${id}`);

      // 2초 후 복사 상태 초기화
      setTimeout(() => {
        setCopiedId(null);
      }, 2000);
    } catch (error) {
      console.error("클립보드 복사 실패:", error);
    }
  };

  if (loading) return <CompanyMemberListSkeleton />;

  return (
    <div className="space-y-3">
      {list && list.length > 0 ? (
        list.map((item) => {
          const statusInfo = getStatusInfo(item.status);
          const transactionDate = new Date(item.createdAt);
          const isMerchantUidCopied =
            copiedId === `merchant_${item.merchantUid}`;
          const isPaymentIdCopied =
            copiedId === `payment_${item.funeralPaymentId}`;

          return (
            <div
              key={item.funeralCashHistoryId}
              className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">
                    {getTransactionTypeText(item.transactionType)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {transactionDate.toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-lg font-bold ${
                      item.funeralCashAmount > 0
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.funeralCashAmount > 0 ? "+" : ""}
                    {item.funeralCashAmount.toLocaleString()}원
                  </div>
                  <div className="text-sm text-gray-500">
                    잔액: {item.funeralCashBalanceAfter.toLocaleString()}원
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  {/* 고객사 거래번호 복사 버튼 */}
                  <button
                    onClick={() =>
                      copyToClipboard(item.merchantUid, "merchant")
                    }
                    className={`px-2 py-1 text-xs rounded border transition-colors text-left ${
                      isMerchantUidCopied
                        ? "text-green-600 border-green-300 bg-green-50"
                        : "text-gray-500 border-gray-300 hover:text-gray-700 hover:border-gray-400"
                    }`}
                    title="클릭하여 고객사 거래번호 복사"
                  >
                    {isMerchantUidCopied
                      ? "✓ 고객사 거래번호 복사됨"
                      : `고객사 거래번호: ${item.merchantUid}`}
                  </button>

                  {/* 결제 ID 복사 버튼 (결제 ID가 있는 경우만 표시) */}
                  <button
                    onClick={() =>
                      copyToClipboard(item.funeralPaymentId, "payment")
                    }
                    className={`px-2 py-1 text-xs rounded border transition-colors text-left ${
                      isPaymentIdCopied
                        ? "text-green-600 border-green-300 bg-green-50"
                        : "text-blue-500 border-blue-300 hover:text-blue-700 hover:border-blue-400"
                    }`}
                    title="클릭하여 imp_uid 복사"
                  >
                    {isPaymentIdCopied
                      ? "✓ imp_uid 복사됨"
                      : `imp_uid: ${item.funeralPaymentId}`}
                  </button>
                </div>

                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.className}`}
                >
                  {statusInfo.text}
                </span>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center text-gray-400 py-8">
          <div className="text-lg font-medium">내역이 없습니다</div>
          <div className="text-sm">캐시 충전 내역이 없습니다.</div>
        </div>
      )}
    </div>
  );
}
