"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import FuneralHallCashChargeList from "@/components/funeral-hall/FuneralHallCashChargeList";
import FuneralHallMemberDetailTabs from "@/components/funeral-hall/FuneralHallMemberDetailTabs";

// 더미 fetch 함수 (실제 API 연동시 대체)
function fetchFuneralHallMemberDetail(id: string) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: "김영희",
        email: "kim@hanulae.com",
        phone: "010-1234-5678",
        funeralHall: "하늘장례식장",
        currentPoints: 75000,
        currentCash: 150000,
      });
    }, 1200);
  });
}

export default function FuneralHallMemberDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [member, setMember] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: 실제 API 연동 fetchFuneralHallMemberDetail(params.id)
    fetchFuneralHallMemberDetail(params.id).then((data) => {
      setMember(data);
      setLoading(false);
    });
  }, [params.id]);

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
                    member.email
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
                <div className="text-xs text-gray-500">장례식장</div>
                <div className="font-medium">
                  {loading ? (
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    member.funeralHall
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
        <FuneralHallMemberDetailTabs memberId={params.id} />
      </div>
    </div>
  );
}
