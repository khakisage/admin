"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import FuneralHallCashChargeList from "@/components/funeral-hall/FuneralHallCashChargeList";
import FuneralHallMemberDetailTabs from "@/components/funeral-hall/FuneralHallMemberDetailTabs";
import { userAPI } from "@/lib/api"; // API 모듈 경로 확인

async function fetchFuneralHallMemberDetail(userId: string) {
  // Call the API to get funeral hall member details
  const response = await userAPI.getUserDetail(userId, "funeral");
  console.log("🚀 ~ fetchFuneralHallMemberDetail ~ response:", response);
  // Process the response data to match the desired structure
  return {
    id: response.data.funeral.funeralId,
    name: response.data.funeral.funeralName,
    username: response.data.funeral.funeralUsername,
    phone: response.data.funeral.funeralPhoneNumber,
    bankName: response.data.funeral.funeralBankName,
    bankNumber: response.data.funeral.funeralBankNumber,
    currentPoints: response.data.funeral.funeralPoint,
    currentCash: response.data.funeral.funeralCash,
    createdAt: response.data.funeral.createdAt,
    updatedAt: response.data.funeral.updatedAt,
  };
}

export default function FuneralHallMemberDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [id, setId] = useState<string | null>(null);
  const [member, setMember] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    fetchFuneralHallMemberDetail(id).then((data) => {
      console.log("Fetched funeral hall member data:", data); // 데이터 확인
      setMember(data);
      setLoading(false);
    }).catch((error) => {
      console.error("Error fetching funeral hall member detail:", error);
      setLoading(false);
    });
  }, [id]);

  if (!id) return null;

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col items-center p-8 bg-white">
      <div className="w-full">
        <Card className="w-full bg-blue-50 mb-8">
          <CardContent className="w-full p-6 flex flex-col gap-2">
            {loading ? (
              <div className="h-7 w-32 bg-gray-200 rounded mb-4 animate-pulse" />
            ) : (
              <div className="text-2xl font-bold mb-2">{member.name}</div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">이메일</div>
                <div className="font-medium">
                  {loading ? (
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    member.username
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">전화번호</div>
                <div className="font-medium">
                  {loading ? (
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    member.phone
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">은행명</div>
                <div className="font-medium">
                  {loading ? (
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    member.bankName
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">계좌번호</div>
                <div className="font-medium">
                  {loading ? (
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    member.bankNumber
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">포인트</div>
                <div className="font-medium">
                  {loading ? (
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    member.currentPoints.toLocaleString() + " P"
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">캐시</div>
                <div className="font-medium">
                  {loading ? (
                    <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    member.currentCash.toLocaleString() + " 원"
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* 공통 탭 UI */}
        <FuneralHallMemberDetailTabs memberId={id} />
      </div>
    </div>
  );
}
