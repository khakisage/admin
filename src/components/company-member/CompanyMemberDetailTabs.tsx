import { useState } from "react";
import CompanyMemberCashChargeList from "./CompanyMemberCashChargeList";
import CompanyMemberCashRefundRequestList from "./CompanyMemberCashRefundRequestList";
import CompanyMemberCashRefundList from "./CompanyMemberCashRefundList";
import CompanyMemberApplyList from "./CompanyMemberApplyList";

const TAB_LIST = [
  { key: "charge", label: "캐시 충전 내역" },
  { key: "refundRequest", label: "캐시 환급 신청 내역" },
  { key: "refund", label: "캐시 환급 내역" },
  { key: "apply", label: "출동 신청 내역" },
];

export default function CompanyMemberDetailTabs({
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
        {tab === "charge" && (
          <CompanyMemberCashChargeList memberId={memberId} />
        )}
        {tab === "refundRequest" && (
          <CompanyMemberCashRefundRequestList memberId={memberId} />
        )}
        {tab === "refund" && (
          <CompanyMemberCashRefundList memberId={memberId} />
        )}
        {tab === "apply" && <CompanyMemberApplyList memberId={memberId} />}
      </div>
    </div>
  );
}
