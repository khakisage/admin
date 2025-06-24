"use client";
import { useState } from "react";
import FuneralHallCashChargeList from "./FuneralHallCashChargeList";
import FuneralHallCashRefundRequestList from "./FuneralHallCashRefundRequestList";
import FuneralHallCashRefundList from "./FuneralHallCashRefundList";
import FuneralHallEstimateRequestList from "./FuneralHallEstimateRequestList";
import FuneralHallDispatchList from "./FuneralHallDispatchList";

const TAB_LIST = [
  { key: "charge", label: "캐시 충전 내역" },
  { key: "refundRequest", label: "캐시 환급 신청 내역" },
  { key: "refund", label: "캐시 환급 내역" },
  { key: "estimate", label: "견적 신청 내역" },
  { key: "dispatch", label: "출동 내역" },
];

export default function FuneralHallMemberDetailTabs({
  memberId,
}: {
  memberId: string;
}) {
  const [tab, setTab] = useState("charge");

  return (
    <div>
      <div className="flex gap-4 mb-4">
        {TAB_LIST.map((t) => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded font-medium border transition-colors ${
              tab === t.key
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            }`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div>
        {tab === "charge" && <FuneralHallCashChargeList memberId={memberId} />}
        {tab === "refundRequest" && (
          <FuneralHallCashRefundRequestList memberId={memberId} />
        )}
        {tab === "refund" && <FuneralHallCashRefundList memberId={memberId} />}
        {tab === "estimate" && (
          <FuneralHallEstimateRequestList memberId={memberId} />
        )}
        {tab === "dispatch" && <FuneralHallDispatchList memberId={memberId} />}
      </div>
    </div>
  );
}
