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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cashAPI } from "@/lib/api";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import { format } from "date-fns";
import { ko } from "date-fns/locale";

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

function getTodayKST() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 9 * 60 * 60000);
}

export default function RefundHistoryPage() {
  const [data, setData] = useState<RefundHistory[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set());
  const [isExporting, setIsExporting] = useState(false);

  // 날짜 필터링 관련 state
  const [dateMode, setDateMode] = useState<"day" | "range">("day");
  const [selectedDate, setSelectedDate] = useState<Date>(getTodayKST());
  const [dateRange, setDateRange] = useState<{
    start: Date | undefined;
    end: Date | undefined;
  }>({
    start: getTodayKST(),
    end: getTodayKST(),
  });

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    fetchData();
  }, [filterType, hydrated]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await cashAPI.getRefundHistory(filterType);
      console.log("🚀 ~ fetchData ~ result:", result);

      // data 배열을 RefundHistory[]로 변환
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const histories = (result.data || []).map((item: any) => ({
        id: item.refundRequestId || item.id,
        memberName: item.manager?.managerName || item.funeral?.funeralName || "",
        memberType: item.manager ? "manager" as const : "funeral" as const,
        company: item.manager?.managerBankName || item.funeral?.funeralBankName || "",
        refundDate: item.createdAt,
        amount: item.refundAmount,
        bankName: item.manager?.managerBankName || item.funeral?.funeralBankName || "",
        accountNumber: item.manager?.managerBankNumber || item.funeral?.funeralBankNumber || "",
        status: item.status === "approved" ? "completed" as const : "failed" as const, // 필요시 status 매핑
      }));

      setData(histories);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!hydrated) return null;

  // 날짜 필터링이 적용된 데이터
  const dateFilteredData = data.filter((item) => {
    if (!item.refundDate) return true;
    
    const itemDate = new Date(item.refundDate);
    
    if (dateMode === "day") {
      const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
      const itemDateStr = format(itemDate, "yyyy-MM-dd");
      return selectedDateStr === itemDateStr;
    } else {
      // range mode
      if (!dateRange.start || !dateRange.end) return true;
      
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      
      // 시간을 00:00:00으로 설정하여 날짜만 비교
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(23, 59, 59, 999);
      itemDate.setHours(12, 0, 0, 0); // 중간 시간으로 설정
      
      return itemDate >= startDate && itemDate <= endDate;
    }
  });

  const filteredData = dateFilteredData.filter((item) => {
    const matchesSearch =
      item.memberName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.company?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || item.memberType === filterType;
    return matchesSearch && matchesType;
  });

  // 체크박스 관련 함수들
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredData.map(item => item.id);
      setSelectedItems(new Set(allIds));
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
  const handleExcelExport = () => {
    if (selectedItems.size === 0) {
      toast.error("다운로드할 항목을 선택해주세요.");
      return;
    }

    setIsExporting(true);

    try {
      const selectedData = data.filter(item => selectedItems.has(item.id));
      
      const excelData = selectedData.map((item, index) => ({
        '순번': index + 1,
        '이름': item.memberName,
        '회원유형': item.memberType === 'manager' ? '상조팀장' : '장례식장',
        '회사명': item.company,
        '은행명': item.bankName,
        '계좌번호': item.accountNumber,
        '환급금액': item.amount,
        '환급일자': item.refundDate,
        '처리상태': item.status === 'completed' ? '완료' : '실패',
        '다운로드일자': new Date().toISOString().split('T')[0]
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, '환급내역');

      // 파일명에 현재 날짜 포함
      const today = new Date().toISOString().split('T')[0];
      const filename = `환급내역_${today}.xlsx`;

      XLSX.writeFile(workbook, filename);

      toast.success(`${selectedItems.size}건의 환급 내역이 엑셀로 다운로드되었습니다.`);
      
      // 선택 초기화
      setSelectedItems(new Set());

    } catch (error) {
      console.error("엑셀 다운로드 실패:", error);
      toast.error("엑셀 다운로드 중 오류가 발생했습니다.");
    } finally {
      setIsExporting(false);
    }
  };

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

  const allItemsSelected = filteredData.length > 0 && filteredData.every(item => selectedItems.has(item.id));

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error}</div>;

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>캐시 환급 내역</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-0">
          {/* 날짜 필터 영역 */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-4 mb-4">
              <ToggleGroup
                type="single"
                value={dateMode}
                onValueChange={(val) => setDateMode((val as "day" | "range") ?? "day")}
              >
                <ToggleGroupItem value="day" aria-label="특정일">
                  특정일
                </ToggleGroupItem>
                <ToggleGroupItem value="range" aria-label="기간">
                  기간
                </ToggleGroupItem>
              </ToggleGroup>

              {/* 날짜 선택 */}
              {dateMode === "day" ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-[160px] justify-start">
                      {format(selectedDate, "yyyy-MM-dd (EEE)", { locale: ko })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(d) => d && setSelectedDate(d)}
                      locale={ko}
                    />
                  </PopoverContent>
                </Popover>
              ) : (
                <>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[160px] justify-start">
                        {dateRange.start
                          ? format(dateRange.start, "yyyy-MM-dd (EEE)", { locale: ko })
                          : "시작일"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Calendar
                        mode="single"
                        selected={dateRange.start}
                        onSelect={(d) => setDateRange((r) => ({ ...r, start: d }))}
                        locale={ko}
                      />
                    </PopoverContent>
                  </Popover>
                  <span className="mx-2">~</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[160px] justify-start">
                        {dateRange.end
                          ? format(dateRange.end, "yyyy-MM-dd (EEE)", { locale: ko })
                          : "종료일"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="p-0">
                      <Calendar
                        mode="single"
                        selected={dateRange.end}
                        onSelect={(d) => setDateRange((r) => ({ ...r, end: d }))}
                        locale={ko}
                      />
                    </PopoverContent>
                  </Popover>
                </>
              )}
            </div>
          </div>

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
            
            {/* 엑셀 다운로드 버튼 */}
            {filteredData.length > 0 && (
              <div className="flex gap-2">
                <Button
                  onClick={handleExcelExport}
                  disabled={selectedItems.size === 0 || isExporting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isExporting ? "다운로드 중..." : `선택된 ${selectedItems.size}건 엑셀 다운로드`}
                </Button>
              </div>
            )}
          </div>

          {/* 환급 내역 목록 */}
          <div className="p-6 space-y-4">
            {filteredData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {data.length === 0 ? "환급 내역이 없습니다." : "검색 조건에 맞는 결과가 없습니다."}
              </div>
            ) : (
              <>
                {/* 전체 선택 체크박스 */}
                <div className="flex items-center space-x-2 border-b pb-2">
                  <input
                    type="checkbox"
                    checked={allItemsSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm font-medium">
                    전체 선택 ({filteredData.length}건)
                  </span>
                </div>

                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border p-4 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      {/* 체크박스 */}
                      <div className="min-w-[20px]">
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                          className="w-4 h-4"
                        />
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
                ))}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
