"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";
import { userAPI } from "@/lib/api";

interface FuneralHallMember {
  id: number;
  name: string;
  funeralHall: string;
  phone: string;
  email: string;
  address: string;
  joinDate: string;
  status: "active" | "inactive";
  currentPoints: number;
  currentCash: number;
}

export default function FuneralHallsPage() {
  const [data, setData] = useState<FuneralHallMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await userAPI.getFuneralList();
        setData(result.data.funerals); // funerals 배열을 설정
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // 검색 로직
  const filteredData = data.filter((item: any) => {
    const matchesSearch =
      item.funeralName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.funeralHallName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.funeralPhoneNumber.includes(searchTerm) ||
      item.funeralUsername.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: boolean) => {
    return status ? "text-green-600" : "text-red-600";
  };

  const getStatusText = (status: boolean) => {
    return status ? "활성" : "비활성";
  };

  if (isLoading) {
    return <div className="text-center py-8 text-muted-foreground">로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">에러: {error}</div>;
  }

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>장례식장 회원 관리</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-0">
          {/* 검색 영역 */}
          <div className="p-6 border-b">
            <Input
              placeholder="이름, 장례식장명, 전화번호, 이메일로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* 회원 목록 */}
          <div className="p-6 space-y-4">
            {filteredData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                검색 결과가 없습니다.
              </div>
            ) : (
              filteredData.map((item) => (
                <div
                  key={item.funeralId} // 올바른 키 사용
                  className="flex justify-between items-center border p-4 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() =>
                    router.push(`/admin/members/funeral-halls/${item.funeralId}`)
                  }
                >
                  <div className="flex items-center space-x-8 flex-1">
                    <div className="min-w-[120px] font-semibold">
                      {item.funeralName} {/* 올바른 필드 사용 */}
                    </div>
                    <div className="min-w-[200px] text-sm text-muted-foreground truncate">
                      {item.funeralUsername} {/* 올바른 필드 사용 */}
                    </div>
                    <div
                      className={`min-w-[80px] text-sm font-medium ${getStatusColor(
                        item.isApproved // 상태에 따라 색상 설정
                      )}`}
                    >
                      {getStatusText(item.isApproved)}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
