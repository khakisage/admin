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
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import { cashAPI } from "@/lib/api";

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

export default function RefundRequestPage() {
  const [data, setData] = useState<RefundRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await cashAPI.getAllRefundRequests(filterType);
        console.log("🚀 ~ fetchData ~ result:", result);

        // approved, rejected, requested 배열을 합쳐서 RefundRequest[] 형태로 변환
        const toRefundRequest = (item: any, status: string): RefundRequest => ({
          id: item.refundRequestId || item.id,
          memberName: item.manager?.managerName || item.funeral?.funeralName || "",
          memberType: item.manager ? "manager" : "funeral",
          company: item.manager?.managerBankName || item.funeral?.funeralBankName || "",
          requestDate: item.createdAt,
          amount: item.refundAmount,
          bankName: item.manager?.managerBankName || item.funeral?.funeralBankName || "",
          accountNumber: item.manager?.managerBankNumber || item.funeral?.funeralBankNumber || "",
          status,
        });

        const requested = (result.data.requested || []).map((item: any) => toRefundRequest(item, "pending"));
        const approved = (result.data.approved || []).map((item: any) => toRefundRequest(item, "approved"));
        const rejected = (result.data.rejected || []).map((item: any) => toRefundRequest(item, "rejected"));

        setData([...requested, ...approved, ...rejected]);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filterType]);

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // TODO: API 도입 시 useMutation으로 변경
  // const approveMutation = useApproveRefund()
  const handleApprove = async (id: number, type: "manager" | "funeral") => {
    try {
      await cashAPI.processRefundApproval({ type, requestId: id, action: "approve" });
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "approved" as const } : item
        )
      );
    } catch (e) {
      alert("환급 승인 처리에 실패했습니다.");
    }
  };

  // TODO: API 도입 시 useMutation으로 변경
  // const rejectMutation = useRejectRefund()
  const handleReject = async (id: number, type: "manager" | "funeral") => {
    try {
      await cashAPI.processRefundApproval({ type, requestId: id, action: "reject" });
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "rejected" as const } : item
        )
      );
    } catch (e) {
      alert("환급 거절 처리에 실패했습니다.");
    }
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

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

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
                            <MenubarItem onClick={() => handleApprove(item.id, item.memberType)}>
                              승인
                            </MenubarItem>
                          )}
                          {canReject(item.status) && (
                            <MenubarItem onClick={() => handleReject(item.id, item.memberType)}>
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
