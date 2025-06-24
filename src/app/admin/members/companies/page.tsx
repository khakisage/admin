"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import { useState } from "react";

interface CompanyMember {
  id: number;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  joinDate: string;
  status: "active" | "inactive";
  currentPoints: number;
  currentCash: number;
}

// TODO: API 도입 시 제거하고 useQuery로 대체
// const { data, isLoading, error } = useCompanyMembers()
// API 엔드포인트: GET /api/admin/user/userList?type=manager
// const useCompanyMembers = () => {
//   return useQuery({
//     queryKey: ['company-members'],
//     queryFn: async () => {
//       const response = await fetch('/api/admin/user/userList?type=manager')
//       if (!response.ok) {
//         throw new Error('상조팀장 목록 조회 실패')
//       }
//       const data = await response.json()
//       return data.data
//     }
//   })
// }
const dummyData: CompanyMember[] = [
  {
    id: 1,
    name: "홍길동",
    company: "하늘상조",
    phone: "010-1234-5678",
    email: "hong@hanulae.com",
    address: "서울시 강남구 테헤란로 123",
    joinDate: "2025-01-15",
    status: "active",
    currentPoints: 50000,
    currentCash: 100000,
  },
  {
    id: 2,
    name: "김철수",
    company: "평안상조",
    phone: "010-2345-6789",
    email: "kim@pyungan.com",
    address: "서울시 서초구 서초대로 456",
    joinDate: "2025-02-20",
    status: "active",
    currentPoints: 75000,
    currentCash: 150000,
  },
  {
    id: 3,
    name: "박영희",
    company: "천국상조",
    phone: "010-3456-7890",
    email: "park@cheonguk.com",
    address: "서울시 마포구 홍대로 789",
    joinDate: "2025-03-10",
    status: "inactive",
    currentPoints: 30000,
    currentCash: 80000,
  },
  {
    id: 4,
    name: "이민수",
    company: "하늘상조",
    phone: "010-4567-8901",
    email: "lee@hanulae.com",
    address: "서울시 송파구 올림픽로 321",
    joinDate: "2025-04-05",
    status: "active",
    currentPoints: 120000,
    currentCash: 200000,
  },
];

export default function CompaniesPage() {
  // TODO: API 도입 시 useState 제거하고 useQuery 사용
  // const { data, isLoading, error } = useCompanyMembers()
  // if (isLoading) return <LoadingSpinner />
  // if (error) return <ErrorMessage error={error} />
  const [data] = useState(dummyData);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // 검색 로직
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.phone.includes(searchTerm) ||
      item.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600";
      case "inactive":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "활성";
      case "inactive":
        return "비활성";
      default:
        return status;
    }
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>상조팀장 회원 관리</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-0">
          {/* 검색 영역 */}
          <div className="p-6 border-b">
            <Input
              placeholder="이름, 회사명, 전화번호, 이메일로 검색"
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
                  key={item.id}
                  className="flex justify-between items-center border p-4 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() =>
                    router.push(`/admin/members/companies/${item.id}`)
                  }
                >
                  <div className="flex items-center space-x-8 flex-1">
                    <div className="min-w-[120px] font-semibold">
                      {item.name}
                    </div>
                    <div className="min-w-[200px] text-sm text-muted-foreground truncate">
                      {item.email}
                    </div>
                    <div
                      className={`min-w-[80px] text-sm font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {getStatusText(item.status)}
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
