"use client";
import { useEffect, useState } from "react";
import CompanyMemberInfoCard from "@/components/company-member/CompanyMemberInfoCard";
import CompanyMemberInfoCardSkeleton from "@/components/company-member/CompanyMemberInfoCardSkeleton";
import CompanyMemberDetailTabs from "@/components/company-member/CompanyMemberDetailTabs";
import { userAPI } from "@/lib/api";

async function fetchMemberDetail(userId: string) {
  // Call the API to get manager details
  const response = await userAPI.getUserDetail(userId, "manager");
  // Process the response data to match the desired structure
  return {
    id: response.data.manager.managerId,
    name: response.data.manager.managerName,
    phone: response.data.manager.managerPhoneNumber,
    username: response.data.manager.managerUsername,
    bank: response.data.manager.managerBankName + " " + response.data.manager.managerBankNumber,
    currentPoints: response.data.manager.managerPoint,
    currentCash: response.data.manager.managerCash,
    approvedAt: response.data.manager.approvedAt,
    createdAt: response.data.manager.createdAt,
    updatedAt: response.data.manager.updatedAt,
    isApproved: response.data.manager.isApproved,
  };
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
      // console.log("Fetched member data:", data); // Log the data
      setMember(data);
      setLoading(false);
    });
  }, [id]);

  if (!id) return null;

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col items-center p-8 bg-white">
      <div className="w-full overflow-y-auto" style={{scrollbarWidth: "none", msOverflowStyle: "none"}}>
        {loading ? (
          <CompanyMemberInfoCardSkeleton />
        ) : (
          <CompanyMemberInfoCard member={member} />
        )}
        <div className="mt-8">
          <CompanyMemberDetailTabs memberId={id} memberType="manager" />
        </div>
      </div>
    </div>
  );
}
