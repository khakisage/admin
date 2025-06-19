"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";

interface ChargeHistory {
  id: number;
  amount: number;
  paymentDate: string;
  memberName: string;
  memberType: "manager" | "funeral";
  company: string;
  paymentMethod: string;
  status: "completed" | "pending" | "failed";
}

// TODO: API 도입 시 제거하고 useQuery로 대체
// const { data, isLoading, error } = useChargeHistory()
const dummyData: ChargeHistory[] = [
  {
    id: 1,
    amount: 100000,
    paymentDate: "2025-06-17 14:30:00",
    memberName: "홍길동",
    memberType: "manager",
    company: "하늘상조",
    paymentMethod: "카드결제",
    status: "completed",
  },
  {
    id: 2,
    amount: 50000,
    paymentDate: "2025-06-16 09:15:00",
    memberName: "김영희",
    memberType: "funeral",
    company: "하늘장례식장",
    paymentMethod: "카드결제",
    status: "completed",
  },
  {
    id: 3,
    amount: 200000,
    paymentDate: "2025-06-15 16:45:00",
    memberName: "박철수",
    memberType: "manager",
    company: "평안상조",
    paymentMethod: "카드결제",
    status: "completed",
  },
  {
    id: 4,
    amount: 75000,
    paymentDate: "2025-06-14 11:20:00",
    memberName: "이미영",
    memberType: "funeral",
    company: "천국장례식장",
    paymentMethod: "카드결제",
    status: "pending",
  },
];

export default function ChargeHistoryPage() {
  // TODO: API 도입 시 useState 제거하고 useQuery 사용
  // const { data, isLoading, error } = useChargeHistory()
  // if (isLoading) return <LoadingSpinner />
  // if (error) return <ErrorMessage error={error} />
  const [data] = useState(dummyData);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  // 필터링 및 검색 로직
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.memberType === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "완료";
      case "pending":
        return "처리중";
      case "failed":
        return "실패";
      default:
        return status;
    }
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>캐시 충전 내역</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-0">
          {/* 검색 및 필터 영역 */}
          <div className="p-6 border-b">
            <div className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="이름 또는 회사명으로 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="회원 유형" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="manager">상조팀장</SelectItem>
                  <SelectItem value="funeral">장례식장</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 충전 내역 목록 */}
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
                      <div className="font-semibold">{item.memberName}</div>
                      <div className="text-xs text-gray-500">
                        {item.memberType === "manager"
                          ? "상조팀장"
                          : "장례식장"}
                      </div>
                    </div>
                    <div className="min-w-[150px] text-sm text-muted-foreground">
                      {item.company}
                    </div>
                    <div className="min-w-[120px] text-sm text-muted-foreground">
                      {item.amount.toLocaleString()}원
                    </div>
                    <div className="min-w-[150px] text-sm text-muted-foreground">
                      {item.paymentDate}
                    </div>
                    <div className="min-w-[100px] text-sm text-muted-foreground">
                      {item.paymentMethod}
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
