"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cashAPI } from "@/lib/api";

interface RefundHistory {
  id: number;
  memberName: string;
  memberType: "manager" | "funeral";
  company: string;
  refundDate: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  status: "completed" | "failed";
}

export default function RefundHistoryPage() {
  const [data, setData] = useState<RefundHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return; // <-- 여기서만 조건 분기!
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await cashAPI.getRefundHistory(filterType);
        // managers, funerals 배열을 합쳐서 RefundHistory[] 형태로 변환
        const managers = (result.data.managers || []).map((item: any) => ({
          id: item.id,
          memberName: item.memberName,
          memberType: "manager",
          company: item.company,
          refundDate: item.refundDate,
          amount: item.amount,
          bankName: item.bankName,
          accountNumber: item.accountNumber,
          status: item.status,
        }));
        const funerals = (result.data.funerals || []).map((item: any) => ({
          id: item.id,
          memberName: item.memberName,
          memberType: "funeral",
          company: item.company,
          refundDate: item.refundDate,
          amount: item.amount,
          bankName: item.bankName,
          accountNumber: item.accountNumber,
          status: item.status,
        }));
        setData([...managers, ...funerals]);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filterType, hydrated]); // hydrated도 의존성에 추가

  if (!hydrated) return null; // Hook 아래에서만 return!

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.memberType === filterType;
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600";
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
      case "failed":
        return "실패";
      default:
        return status;
    }
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>캐시 환급 내역</CardTitle>
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

          {/* 환급 내역 목록 */}
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
                      {item.refundDate}
                    </div>
                    <div className="min-w-[150px] text-sm text-muted-foreground">
                      {item.bankName} {item.accountNumber}
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
