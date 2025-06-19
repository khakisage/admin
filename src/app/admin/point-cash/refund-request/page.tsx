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
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";

import { useState } from "react";

interface RefundRequest {
  id: number;
  memberName: string;
  memberType: "manager" | "funeral";
  company: string;
  requestDate: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  status: "pending" | "approved" | "rejected" | "completed";
}

// TODO: API 도입 시 제거하고 useQuery로 대체
// const { data, isLoading, error } = useRefundRequests()
const dummyData: RefundRequest[] = [
  {
    id: 1,
    memberName: "홍길동",
    memberType: "manager",
    company: "하늘상조",
    requestDate: "2025-06-17",
    amount: 50000,
    bankName: "신한은행",
    accountNumber: "110-123-456789",
    status: "pending",
  },
  {
    id: 2,
    memberName: "김영희",
    memberType: "funeral",
    company: "하늘장례식장",
    requestDate: "2025-06-16",
    amount: 100000,
    bankName: "국민은행",
    accountNumber: "123-456-789012",
    status: "pending",
  },
  {
    id: 3,
    memberName: "박철수",
    memberType: "manager",
    company: "평안상조",
    requestDate: "2025-06-15",
    amount: 75000,
    bankName: "우리은행",
    accountNumber: "1002-123-456789",
    status: "approved",
  },
  {
    id: 4,
    memberName: "이미영",
    memberType: "funeral",
    company: "천국장례식장",
    requestDate: "2025-06-14",
    amount: 30000,
    bankName: "하나은행",
    accountNumber: "123-456789-01",
    status: "rejected",
  },
];

export default function RefundRequestPage() {
  // TODO: API 도입 시 useState 제거하고 useQuery 사용
  // const { data, isLoading, error } = useRefundRequests()
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
  // const approveMutation = useApproveRefund()
  const handleApprove = (id: number) => {
    console.log(`환급 승인 요청: ${id}`);
    // TODO: 환급 승인 API 호출
    // approveMutation.mutate(id, {
    //   onSuccess: () => {
    //     queryClient.invalidateQueries(['refund-requests'])
    //   }
    // })
    // 승인 후 상태 변경
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "approved" as const } : item
      )
    );
  };

  // TODO: API 도입 시 useMutation으로 변경
  // const rejectMutation = useRejectRefund()
  const handleReject = (id: number) => {
    console.log(`환급 거절 요청: ${id}`);
    // TODO: 환급 거절 API 호출
    // rejectMutation.mutate(id, {
    //   onSuccess: () => {
    //     queryClient.invalidateQueries(['refund-requests'])
    //   }
    // })
    // 거절 후 상태 변경
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "rejected" as const } : item
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "approved":
        return "text-blue-600";
      case "rejected":
        return "text-red-600";
      case "completed":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "대기중";
      case "approved":
        return "승인됨";
      case "rejected":
        return "거절됨";
      case "completed":
        return "완료";
      default:
        return status;
    }
  };

  const canApprove = (status: string) => status === "pending";
  const canReject = (status: string) => status === "pending";

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>환급 신청 목록</CardTitle>
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

          {/* 환급 신청 목록 */}
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
                    <div className="min-w-[120px] text-sm text-muted-foreground">
                      {item.requestDate}
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
                  {(canApprove(item.status) || canReject(item.status)) && (
                    <Menubar>
                      <MenubarMenu>
                        <MenubarTrigger className="cursor-pointer">
                          ⋯
                        </MenubarTrigger>
                        <MenubarContent>
                          {canApprove(item.status) && (
                            <MenubarItem onClick={() => handleApprove(item.id)}>
                              승인
                            </MenubarItem>
                          )}
                          {canReject(item.status) && (
                            <MenubarItem onClick={() => handleReject(item.id)}>
                              거절
                            </MenubarItem>
                          )}
                        </MenubarContent>
                      </MenubarMenu>
                    </Menubar>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
