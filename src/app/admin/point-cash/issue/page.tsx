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
import PointIssueDialog from "@/components/common/PointIssueDialog";
import { toast } from "sonner";

import { useState } from "react";

interface PointIssue {
  id: number;
  memberName: string;
  memberType: "manager" | "funeral";
  company: string;
  currentPoints: number;
  currentCash: number;
  lastIssueDate: string;
}

// TODO: API 도입 시 제거하고 useQuery로 대체
// const { data, isLoading, error } = usePointIssues()
const dummyData: PointIssue[] = [
  {
    id: 1,
    memberName: "홍길동",
    memberType: "manager",
    company: "하늘상조",
    currentPoints: 50000,
    currentCash: 100000,
    lastIssueDate: "2025-06-15",
  },
  {
    id: 2,
    memberName: "김영희",
    memberType: "funeral",
    company: "하늘장례식장",
    currentPoints: 75000,
    currentCash: 150000,
    lastIssueDate: "2025-06-14",
  },
  {
    id: 3,
    memberName: "박철수",
    memberType: "manager",
    company: "평안상조",
    currentPoints: 30000,
    currentCash: 80000,
    lastIssueDate: "2025-06-13",
  },
  {
    id: 4,
    memberName: "이미영",
    memberType: "funeral",
    company: "천국장례식장",
    currentPoints: 120000,
    currentCash: 200000,
    lastIssueDate: "2025-06-12",
  },
];

export default function PointIssuePage() {
  // TODO: API 도입 시 useState 제거하고 useQuery 사용
  // const { data, isLoading, error } = usePointIssues()
  // if (isLoading) return <LoadingSpinner />
  // if (error) return <ErrorMessage error={error} />
  const [data, setData] = useState(dummyData);
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

  // TODO: API 도입 시 useMutation으로 변경
  // const issueMutation = useIssuePoint()
  const handleIssue = async (issueData: {
    memberId: number;
    amount: number;
    reason: string;
    type: "point" | "cash";
  }) => {
    console.log("포인트 지급 요청:", issueData);
    // TODO: 포인트 지급 API 호출
    // await issueMutation.mutateAsync(issueData)
    // 성공 시 목록 새로고침
    // queryClient.invalidateQueries(['point-issues'])

    // 더미데이터 업데이트 (임시)
    setData((prev) =>
      prev.map((item) => {
        if (item.id === issueData.memberId) {
          if (issueData.type === "point") {
            return {
              ...item,
              currentPoints: item.currentPoints + issueData.amount,
            };
          } else {
            return {
              ...item,
              currentCash: item.currentCash + issueData.amount,
            };
          }
        }
        return item;
      })
    );

    // 성공 토스트 메시지 표시
    const member = data.find((item) => item.id === issueData.memberId);
    if (member) {
      toast.success(
        `${member.memberName}에게 ${
          issueData.type === "point" ? "포인트" : "캐시"
        } ${issueData.amount.toLocaleString()}원이 지급되었습니다.`
      );
    }
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>포인트/캐시 지급</CardTitle>
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

          {/* 포인트 지급 목록 */}
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
                      포인트: {item.currentPoints.toLocaleString()}원
                    </div>
                    <div className="min-w-[120px] text-sm text-muted-foreground">
                      캐시: {item.currentCash.toLocaleString()}원
                    </div>
                    <div className="min-w-[120px] text-xs text-gray-500">
                      {item.lastIssueDate}
                    </div>
                  </div>
                  <PointIssueDialog
                    trigger={
                      <Button variant="outline" size="sm">
                        포인트 지급
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
