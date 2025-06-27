"use client";
import { useState } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  Legend,
} from "recharts";

function getTodayKST() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 9 * 60 * 60000);
}

const initialDate = getTodayKST();

// 더미 차트 데이터 생성 함수
function makeDummyChartData(days = 7) {
  const arr = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(initialDate);
    d.setDate(d.getDate() - (days - 1 - i));
    arr.push({
      date: format(d, "MM-dd"),
      users: Math.floor(Math.random() * 10),
      payments: Math.floor(Math.random() * 1000000),
      dispatches: Math.floor(Math.random() * 5),
      estimates: Math.floor(Math.random() * 4),
      manager: Math.floor(Math.random() * 5),
      funeral: Math.floor(Math.random() * 3),
    });
  }
  return arr;
}

export default function AdminDashboardPage() {
  const [mode, setMode] = useState<"day" | "range">("day");
  const [date, setDate] = useState<Date>(initialDate);
  const [range, setRange] = useState<{
    start: Date | undefined;
    end: Date | undefined;
  }>({
    start: initialDate,
    end: initialDate,
  });
  const [loading, setLoading] = useState(false);
  // 더미 데이터
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [stats] = useState({
    users: 123,
    payments: 4560000,
    dispatches: 12,
    estimates: 8,
    members: { total: 200, manager: 120, funeral: 80 },
  });
  // 차트용 더미 데이터 (기간 7일)
  const [chartData, setChartData] = useState(makeDummyChartData(7));

  // 조회 버튼 클릭 시 (실제 API 연동시 fetch)
  const handleSearch = () => {
    setLoading(true);
    setTimeout(() => {
      // TODO: 실제 API 연동
      // 예시: 데이터가 없는 경우
      // setChartData([]);
      setChartData(makeDummyChartData(7));
      setLoading(false);
    }, 800);
  };

  // 데이터가 없는 경우 안내
  const renderNoData = () => (
    <div className="flex items-center justify-center h-full text-gray-400">
      기록이 없습니다.
    </div>
  );

  return (
    <div className="w-full h-full p-8 bg-white flex flex-col min-h-screen">
      {/* 상단 조회 조건 */}
      <div className="flex items-center gap-4 mb-8">
        <ToggleGroup
          type="single"
          value={mode}
          onValueChange={(val) => setMode((val as "day" | "range") ?? "day")}
        >
          <ToggleGroupItem value="day" aria-label="특정일">
            특정일
          </ToggleGroupItem>
          <ToggleGroupItem value="range" aria-label="기간">
            기간
          </ToggleGroupItem>
        </ToggleGroup>
        {/* 날짜 선택 */}
        {mode === "day" ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[160px] justify-start">
                {format(date, "yyyy-MM-dd (EEE)", { locale: ko })}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                locale={ko}
              />
            </PopoverContent>
          </Popover>
        ) : (
          <>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[160px] justify-start">
                  {range.start
                    ? format(range.start, "yyyy-MM-dd (EEE)", { locale: ko })
                    : "시작일"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={range.start}
                  onSelect={(d) => setRange((r) => ({ ...r, start: d }))}
                  locale={ko}
                />
              </PopoverContent>
            </Popover>
            <span className="mx-2">~</span>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[160px] justify-start">
                  {range.end
                    ? format(range.end, "yyyy-MM-dd (EEE)", { locale: ko })
                    : "종료일"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={range.end}
                  onSelect={(d) => setRange((r) => ({ ...r, end: d }))}
                  locale={ko}
                />
              </PopoverContent>
            </Popover>
          </>
        )}
        <Button
          onClick={handleSearch}
          disabled={loading}
          className="ml-4 min-w-[80px]"
        >
          {loading ? "조회중..." : "조회"}
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
        <Card className="text-center">
          <CardTitle className="mt-4 text-lg">가입자 수</CardTitle>
          <CardContent className="text-3xl font-bold py-6">
            {stats.users.toLocaleString()}
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardTitle className="mt-4 text-lg">결제 금액</CardTitle>
          <CardContent className="text-3xl font-bold py-6">
            {stats.payments.toLocaleString()}원
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardTitle className="mt-4 text-lg">출동 신청</CardTitle>
          <CardContent className="text-3xl font-bold py-6">
            {stats.dispatches.toLocaleString()}
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardTitle className="mt-4 text-lg">견적 신청</CardTitle>
          <CardContent className="text-3xl font-bold py-6">
            {stats.estimates.toLocaleString()}
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardTitle className="mt-4 text-lg">회원 인원수</CardTitle>
          <CardContent className="py-6">
            <div className="text-xl font-bold">
              {stats.members.total.toLocaleString()}명
            </div>
            <div className="text-xs text-gray-500 mt-2">
              상조팀장 {stats.members.manager} / 장례식장{" "}
              {stats.members.funeral}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 차트 영역 (기간 조회일 때만 표시, 특정일일 때는 빈 공간으로 높이 유지) */}
      {mode === "range" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {/* 가입자 수 LineChart */}
          <Card>
            <CardTitle className="mt-4 ml-6 text-lg">일별 가입자 수</CardTitle>
            <CardContent className="h-64">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                  >
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                renderNoData()
              )}
            </CardContent>
          </Card>
          {/* 결제 금액 BarChart */}
          <Card>
            <CardTitle className="mt-4 ml-6 text-lg">일별 결제 금액</CardTitle>
            <CardContent className="h-64">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                  >
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="payments" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                renderNoData()
              )}
            </CardContent>
          </Card>
          {/* 출동 신청 LineChart */}
          <Card>
            <CardTitle className="mt-4 ml-6 text-lg">일별 출동 신청</CardTitle>
            <CardContent className="h-64">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                  >
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="dispatches"
                      stroke="#f59e42"
                      strokeWidth={2}
                      dot
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                renderNoData()
              )}
            </CardContent>
          </Card>
          {/* 견적 신청 LineChart */}
          <Card>
            <CardTitle className="mt-4 ml-6 text-lg">일별 견적 신청</CardTitle>
            <CardContent className="h-64">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                  >
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="estimates"
                      stroke="#6366f1"
                      strokeWidth={2}
                      dot
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                renderNoData()
              )}
            </CardContent>
          </Card>
          {/* 회원 인원수 StackedBarChart */}
          <Card>
            <CardTitle className="mt-4 ml-6 text-lg">
              회원 인원수(유형별)
            </CardTitle>
            <CardContent className="h-64">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                  >
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="manager"
                      stackId="a"
                      fill="#2563eb"
                      name="상조팀장"
                    />
                    <Bar
                      dataKey="funeral"
                      stackId="a"
                      fill="#10b981"
                      name="장례식장"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                renderNoData()
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="h-[600px]" />
      )}
    </div>
  );
}
