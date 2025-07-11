"use client";

import { useEffect, useState } from "react";
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
import { cashAPI } from "@/lib/api";
import { toast } from "sonner";
import * as XLSX from 'xlsx';

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
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await cashAPI.getAllRefundRequests(filterType);
        // console.log("🚀 ~ fetchData ~ result:", result);

        // approved, rejected, requested 배열을 합쳐서 RefundRequest[] 형태로 변환
        const toRefundRequest = (item: any, status: "pending" | "approved" | "rejected" | "completed"): RefundRequest => ({
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
      } catch (error: any) {
        setError(error.message);
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
    
    // 승인된 항목은 UI에서 숨김 (대기중, 거절됨만 표시)
    const isNotApproved = item.status !== "approved";
    
    return matchesSearch && isNotApproved;
  });

  // 체크박스 관련 함수들
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pendingIds = filteredData
        .filter(item => item.status === "pending")
        .map(item => item.id);
      setSelectedItems(new Set(pendingIds));
    } else {
      setSelectedItems(new Set());
    }
  };

  const handleSelectItem = (id: number, checked: boolean) => {
    const newSelected = new Set(selectedItems);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedItems(newSelected);
  };

  // 엑셀 다운로드 함수
  const downloadExcel = (approvedItems: RefundRequest[]) => {
    const excelData = approvedItems.map((item, index) => ({
      '순번': index + 1,
      '이름': item.memberName,
      '회원유형': item.memberType === 'manager' ? '상조팀장' : '장례식장',
      '회사명': item.company,
      '은행명': item.bankName,
      '계좌번호': item.accountNumber,
      '신청금액': item.amount,
      '신청일자': item.requestDate,
      '처리일자': new Date().toISOString().split('T')[0]
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, '환급승인목록');

    // 파일명에 현재 날짜 포함
    const today = new Date().toISOString().split('T')[0];
    const filename = `환급승인목록_${today}.xlsx`;

    XLSX.writeFile(workbook, filename);
  };

  // 일괄 승인 처리
  const handleBulkApprove = async () => {
    if (selectedItems.size === 0) {
      toast.error("승인할 항목을 선택해주세요.");
      return;
    }

    setIsProcessing(true);
    const approvedItems: RefundRequest[] = [];
    let successCount = 0;
    let failCount = 0;

    try {
      for (const id of selectedItems) {
        const item = data.find(d => d.id === id);
        if (item && item.status === "pending") {
          try {
            await cashAPI.processRefundApproval({ 
              type: item.memberType, 
              requestId: id, 
              action: "approve" 
            });
            approvedItems.push(item);
            successCount++;
          } catch (e) {
            console.error(`ID ${id} 승인 실패:`, e);
            failCount++;
          }
        }
      }

      // 상태 업데이트
      setData((prev) =>
        prev.map((item) =>
          selectedItems.has(item.id) && item.status === "pending"
            ? { ...item, status: "approved" as const }
            : item
        )
      );

      // 선택 초기화
      setSelectedItems(new Set());

      // 결과 알림
      if (successCount > 0) {
        toast.success(`${successCount}건의 환급이 승인되었습니다.`);
        
        // 엑셀 다운로드
        if (approvedItems.length > 0) {
          downloadExcel(approvedItems);
          toast.info("승인된 목록이 엑셀 파일로 다운로드되었습니다.");
        }
      }
      
      if (failCount > 0) {
        toast.error(`${failCount}건의 승인 처리에 실패했습니다.`);
      }

    } catch (error) {
      console.error("일괄 승인 처리 중 오류:", error);
      toast.error("일괄 승인 처리 중 오류가 발생했습니다.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 개별 거절 처리
  const handleReject = async (id: number, type: "manager" | "funeral") => {
    try {
      await cashAPI.processRefundApproval({ type, requestId: id, action: "reject" });
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: "rejected" as const } : item
        )
      );
      toast.success("환급 요청이 거절되었습니다.");
    } catch (error) {
      console.error("환급 거절 처리 실패:", error);
      toast.error("환급 거절 처리에 실패했습니다.");
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

  const pendingItems = filteredData.filter(item => item.status === "pending");
  const allPendingSelected = pendingItems.length > 0 && pendingItems.every(item => selectedItems.has(item.id));

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
            <div className="flex gap-4 mb-4">
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
            
            {/* 일괄 승인 버튼 */}
            {pendingItems.length > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={handleBulkApprove}
                  disabled={selectedItems.size === 0 || isProcessing}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isProcessing ? "처리중..." : `선택된 ${selectedItems.size}건 일괄 승인`}
                </Button>
              </div>
            )}
          </div>

          {/* 환급 신청 목록 */}
          <div className="p-6 space-y-4">
            {filteredData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                검색 결과가 없습니다.
              </div>
            ) : (
              <>
                {/* 전체 선택 체크박스 */}
                {pendingItems.length > 0 && (
                  <div className="flex items-center space-x-2 border-b pb-2">
                    <input
                      type="checkbox"
                      checked={allPendingSelected}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">
                      전체 선택 (대기중인 항목만)
                    </span>
                  </div>
                )}

                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border p-4 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {/* 체크박스 (대기중인 항목만) */}
                      <div className="min-w-[20px]">
                        {item.status === "pending" ? (
                          <input
                            type="checkbox"
                            checked={selectedItems.has(item.id)}
                            onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                            className="w-4 h-4"
                          />
                        ) : (
                          <div className="w-4 h-4"></div>
                        )}
                      </div>

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

                    {/* 거절 버튼 (대기중인 항목만) */}
                    {item.status === "pending" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(item.id, item.memberType)}
                      >
                        거절
                      </Button>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
