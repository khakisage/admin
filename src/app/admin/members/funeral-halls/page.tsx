"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useState } from "react";

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

// TODO: API 도입 시 제거하고 useQuery로 대체
// const { data, isLoading, error } = useFuneralHallMembers()
// API 엔드포인트: GET /api/admin/user/userList?type=funeral
// const useFuneralHallMembers = () => {
//   return useQuery({
//     queryKey: ['funeral-hall-members'],
//     queryFn: async () => {
//       const response = await fetch('/api/admin/user/userList?type=funeral')
//       if (!response.ok) {
//         throw new Error('장례식장 목록 조회 실패')
//       }
//       const data = await response.json()
//       return data.data
//     }
//   })
// }
const dummyData: FuneralHallMember[] = [
  {
    id: 1,
    name: "김영희",
    funeralHall: "하늘장례식장",
    phone: "010-1234-5678",
    email: "kim@hanulae.com",
    address: "서울시 강남구 테헤란로 123",
    joinDate: "2025-01-15",
    status: "active",
    currentPoints: 75000,
    currentCash: 150000,
  },
  {
    id: 2,
    name: "박철수",
    funeralHall: "평안장례식장",
    phone: "010-2345-6789",
    email: "park@pyungan.com",
    address: "서울시 서초구 서초대로 456",
    joinDate: "2025-02-20",
    status: "active",
    currentPoints: 120000,
    currentCash: 200000,
  },
  {
    id: 3,
    name: "이미영",
    funeralHall: "천국장례식장",
    phone: "010-3456-7890",
    email: "lee@cheonguk.com",
    address: "서울시 마포구 홍대로 789",
    joinDate: "2025-03-10",
    status: "inactive",
    currentPoints: 30000,
    currentCash: 80000,
  },
  {
    id: 4,
    name: "최민수",
    funeralHall: "하늘장례식장",
    phone: "010-4567-8901",
    email: "choi@hanulae.com",
    address: "서울시 송파구 올림픽로 321",
    joinDate: "2025-04-05",
    status: "active",
    currentPoints: 180000,
    currentCash: 250000,
  },
];

export default function FuneralHallsPage() {
  // TODO: API 도입 시 useState 제거하고 useQuery 사용
  // const { data, isLoading, error } = useFuneralHallMembers()
  // if (isLoading) return <LoadingSpinner />
  // if (error) return <ErrorMessage error={error} />
  const [data] = useState(dummyData);
  const [searchTerm, setSearchTerm] = useState("");

  // 검색 로직
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.funeralHall.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                  key={item.id}
                  className="flex justify-between items-center border p-4 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-8 flex-1">
                    <div className="min-w-[120px]">
                      <div className="font-semibold">{item.name}</div>
                      <div className="text-xs text-gray-500">장례식장</div>
                    </div>
                    <div className="min-w-[150px] text-sm text-muted-foreground">
                      {item.funeralHall}
                    </div>
                    <div className="min-w-[150px] text-sm text-muted-foreground">
                      {item.phone}
                    </div>
                    <div className="min-w-[200px] text-sm text-muted-foreground truncate">
                      {item.email}
                    </div>
                    <div className="min-w-[200px] text-sm text-muted-foreground truncate">
                      {item.address}
                    </div>
                    <div className="min-w-[120px] text-sm text-muted-foreground">
                      포인트: {item.currentPoints.toLocaleString()}원
                    </div>
                    <div className="min-w-[120px] text-sm text-muted-foreground">
                      캐시: {item.currentCash.toLocaleString()}원
                    </div>
                    <div className="min-w-[100px] text-xs text-gray-500">
                      {item.joinDate}
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
