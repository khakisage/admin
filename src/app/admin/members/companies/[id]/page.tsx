"use client";
import { useEffect, useState } from "react";
import CompanyMemberInfoCard from "@/components/company-member/CompanyMemberInfoCard";
import CompanyMemberInfoCardSkeleton from "@/components/company-member/CompanyMemberInfoCardSkeleton";
import CompanyMemberDetailTabs from "@/components/company-member/CompanyMemberDetailTabs";

// 더미 fetch 함수 (실제 API 연동시 대체)
function fetchMemberDetail(id: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: "홍길동",
        phone: "010-1234-5678",
        email: "hong@hanulae.com",
        bank: "국민은행 123456-78-901234",
        currentPoints: 50000,
        currentCash: 100000,
      });
    }, 1200);
  });
}

export default function CompanyMemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [member, setMember] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetchMemberDetail(id).then((data) => {
      setMember(data);
      setLoading(false);
    });
  }, [id]);

  if (!id) return null;

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col items-center p-8 bg-white">
      <div className="w-full">
        {loading ? (
          <CompanyMemberInfoCardSkeleton />
        ) : (
          <CompanyMemberInfoCard member={member} />
        )}
        <div className="mt-8">
          <CompanyMemberDetailTabs memberId={id} />
        </div>
      </div>
    </div>
  );
}
