"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CashIssueDialog from "@/components/common/PointIssueDialog";
import { toast } from "sonner";

import { useState, useEffect } from "react";
import { userAPI } from "@/lib/api";
import { ko } from "date-fns/locale";
import { format } from "date-fns";

interface CashIssue {
  id: number;
  memberName: string;
  memberType: "manager" | "funeral";
  company: string;
  currentCash: number;
  lastIssueDate: string;
}

export default function CashIssuePage() {
  const [data, setData] = useState<CashIssue[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API에서 유저 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await userAPI.getUserList();
        // console.log("🚀 ~ fetchData ~ result:", result)
        const users = [
          ...result.data.managers.map((manager: any) => ({
            id: manager.managerId,
            memberName: manager.managerName,
            memberType: "manager",
            company: manager.managerBankHolder,
            currentCash: manager.managerCash,
            lastIssueDate: manager.updatedAt,
          })),
          ...result.data.funerals.map((funeral: any) => ({
            id: funeral.funeralId,
            memberName: funeral.funeralName,
            memberType: "funeral",
            company: funeral.funeralBankHolder,
            currentCash: funeral.funeralCash,
            lastIssueDate: funeral.updatedAt,
          })),
        ];
        setData(users);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 필터링 및 검색 로직
  const filteredData = data.filter((item) => {
    const memberName = item.memberType === "manager" ? item.memberName : item.memberName;
    const company = item.memberType === "manager" ? item.company : item.company;
    // console.log("🚀 ~ filteredData ~ item:", item)

    const matchesSearch =
      (memberName?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (company?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesType = filterType === "all" || item.memberType === filterType;
    return matchesSearch && matchesType;
  });

  const handleIssue = async (issueData: {
    memberId: number;
    amount: number;
    reason: string;
  }) => {
    // console.log("캐시 지급 요청:", issueData);

    // 데이터 업데이트
    setData((prev) =>
      prev.map((item) => {
        if (item.id === issueData.memberId) {
          return {
            ...item,
            currentCash: item.currentCash + issueData.amount,
          };
        }
        return item;
      })
    );

    // 성공 토스트 메시지 표시
    const member = data.find((item) => item.id === issueData.memberId);
    if (member) {
      toast.success(
        `${member.memberName}에게 캐시 ${issueData.amount.toLocaleString()}원이 지급되었습니다.`
      );
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>캐시 지급</CardTitle>
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

          {/* 캐시 지급 목록 */}
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
                      캐시: {item.currentCash ? item.currentCash.toLocaleString() : '0'}원
                    </div>
                    <div className="min-w-[120px] text-xs text-gray-500">
                      {format(new Date(item.lastIssueDate), "yyyy년 MM월 dd일 a h시 mm분", { locale: ko })}
                    </div>
                  </div>
                  <CashIssueDialog
                    trigger={
                      <Button variant="outline" size="sm">
                        캐시 지급
                      </Button>
                    }
                    memberId={item.id}
                    memberName={item.memberName}
                    memberType={item.memberType}
                    company={item.company}
                    onIssue={handleIssue}
                  />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
