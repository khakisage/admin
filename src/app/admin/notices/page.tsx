"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import NoticeDetailDialog from "@/components/common/NoticeDetailDialog";
import NoticeFormDialog from "@/components/common/NoticeFormDialog";

import { useState } from "react";

interface Notice {
  id: number;
  title: string;
  content: string;
  userType: "manager" | "funeral" | "all";
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

// TODO: API 도입 시 제거하고 useQuery로 대체
// const { data, isLoading, error } = useNotices()
// API 엔드포인트: GET /api/admin/notices
// const useNotices = () => {
//   return useQuery({
//     queryKey: ['notices'],
//     queryFn: async () => {
//       const response = await fetch('/api/admin/notices')
//       if (!response.ok) {
//         throw new Error('공지사항 목록 조회 실패')
//       }
//       const data = await response.json()
//       return data.data
//     }
//   })
// }

// TODO: API 도입 시 useMutation으로 변경
// const deleteMutation = useDeleteNotice()
// const deleteNotice = async (id: number) => {
//   try {
//     await deleteMutation.mutateAsync(id)
//     toast.success('공지사항이 삭제되었습니다.')
//     queryClient.invalidateQueries(['notices'])
//   } catch (error) {
//     toast.error('공지사항 삭제에 실패했습니다.')
//   }
// }

const dummyData: Notice[] = [
  {
    id: 1,
    title: "시스템 점검 안내",
    content:
      "2025년 6월 20일 새벽 2시부터 4시까지 시스템 점검이 진행됩니다.\n\n점검 시간 동안 서비스 이용이 제한될 수 있으니 참고해 주시기 바랍니다.\n\n점검이 완료되면 정상적으로 서비스를 이용하실 수 있습니다.",
    userType: "all",
    createdAt: "2025-06-15 10:30:00",
    updatedAt: "2025-06-15 10:30:00",
    isActive: true,
  },
  {
    id: 2,
    title: "상조팀장 서비스 이용 안내",
    content:
      "상조팀장 서비스 이용 시 주의사항을 안내드립니다.\n\n1. 고객 정보 보호를 위해 개인정보 처리방침을 준수해 주세요.\n2. 서비스 이용료는 매월 1일에 자동으로 차감됩니다.\n3. 문의사항이 있으시면 고객센터로 연락해 주세요.",
    userType: "manager",
    createdAt: "2025-06-14 14:20:00",
    updatedAt: "2025-06-16 09:15:00",
    isActive: true,
  },
  {
    id: 3,
    title: "장례식장 서비스 이용 안내",
    content:
      "장례식장 서비스 이용 시 주의사항을 안내드립니다.\n\n1. 예약 변경은 24시간 전까지 가능합니다.\n2. 취소 시 수수료가 발생할 수 있습니다.\n3. 시설 이용 시 안전수칙을 준수해 주세요.",
    userType: "funeral",
    createdAt: "2025-06-13 09:15:00",
    updatedAt: "2025-06-13 09:15:00",
    isActive: true,
  },
  {
    id: 4,
    title: "서비스 이용료 변경 안내",
    content:
      "2025년 7월 1일부터 서비스 이용료가 변경됩니다.\n\n변경된 이용료:\n- 상조팀장: 월 50,000원 → 월 55,000원\n- 장례식장: 월 80,000원 → 월 85,000원\n\n기존 고객님들은 3개월간 기존 요금이 적용됩니다.",
    userType: "all",
    createdAt: "2025-06-12 16:45:00",
    updatedAt: "2025-06-12 16:45:00",
    isActive: false,
  },
];

export default function NoticesPage() {
  // TODO: API 도입 시 useState 제거하고 useQuery 사용
  // const { data, isLoading, error } = useNotices()
  // if (isLoading) return <LoadingSpinner />
  // if (error) return <ErrorMessage error={error} />
  const [data, setData] = useState(dummyData);
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // 필터링 및 정렬 로직
  const filteredAndSortedData = data
    .filter((item) => {
      const matchesUserType =
        userTypeFilter === "all" || item.userType === userTypeFilter;
      return matchesUserType;
    })
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const handleDelete = (id: number) => {
    // TODO: API 도입 시 실제 삭제 API 호출
    // deleteNotice(id)

    // 더미데이터에서 삭제 (임시)
    setData((prev) => prev.filter((item) => item.id !== id));
    toast.success("공지사항이 삭제되었습니다.");
  };

  const handleEdit = (notice: Notice) => {
    setEditingNotice(notice);
    setIsEditDialogOpen(true);
  };

  const handleSubmitNotice = async (data: {
    id?: number;
    title: string;
    content: string;
    userType: "manager" | "funeral" | "all";
    isActive: boolean;
  }) => {
    try {
      if (data.id) {
        // 수정 로직
        setData((prev) =>
          prev.map((item) =>
            item.id === data.id
              ? {
                  ...item,
                  title: data.title,
                  content: data.content,
                  userType: data.userType,
                  isActive: data.isActive,
                  updatedAt: new Date()
                    .toISOString()
                    .replace("T", " ")
                    .slice(0, 19),
                }
              : item
          )
        );
        toast.success("공지사항이 수정되었습니다.");
        setIsEditDialogOpen(false);
        setEditingNotice(null);
      } else {
        // 신규 등록 로직
        const newNotice: Notice = {
          id: Math.max(...dummyData.map((item: Notice) => item.id)) + 1,
          title: data.title,
          content: data.content,
          userType: data.userType,
          isActive: data.isActive,
          createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
          updatedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
        };
        setData((prev) => [newNotice, ...prev]);
        toast.success("공지사항이 등록되었습니다.");
      }
    } catch (error) {
      console.error("공지사항 저장 실패:", error);
      toast.error("공지사항 저장에 실패했습니다.");
      throw error;
    }
  };

  const getUserTypeText = (userType: string) => {
    switch (userType) {
      case "manager":
        return "상조팀장";
      case "funeral":
        return "장례식장";
      case "all":
        return "전체";
      default:
        return userType;
    }
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case "manager":
        return "text-blue-600";
      case "funeral":
        return "text-green-600";
      case "all":
        return "text-purple-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>공지사항 관리</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-0">
          {/* 필터 및 정렬 영역 */}
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div className="flex gap-4">
                {/* 유저 타입별 필터 */}
                <Select
                  value={userTypeFilter}
                  onValueChange={setUserTypeFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="유저 타입" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체</SelectItem>
                    <SelectItem value="manager">상조팀장</SelectItem>
                    <SelectItem value="funeral">장례식장</SelectItem>
                  </SelectContent>
                </Select>

                {/* 작성일 기준 정렬 */}
                <Select
                  value={sortOrder}
                  onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="정렬 순서" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="desc">최신순</SelectItem>
                    <SelectItem value="asc">오래된순</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* 신규 공지사항 등록 버튼 */}
              <NoticeFormDialog
                trigger={<Button>신규 공지사항 등록</Button>}
                mode="create"
                onSubmit={handleSubmitNotice}
              />
            </div>
          </div>

          {/* 공지사항 목록 */}
          <div className="p-6 space-y-4">
            {filteredAndSortedData.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                공지사항이 없습니다.
              </div>
            ) : (
              filteredAndSortedData.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border p-4 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-8 flex-1">
                    <div className="min-w-[300px]">
                      <NoticeDetailDialog
                        trigger={
                          <div className="font-semibold cursor-pointer hover:text-blue-600 transition-colors">
                            {item.title}
                          </div>
                        }
                        notice={item}
                      />
                      <div className="text-sm text-muted-foreground truncate max-w-[280px]">
                        {item.content}
                      </div>
                    </div>
                    <div
                      className={`min-w-[100px] text-sm font-medium ${getUserTypeColor(
                        item.userType
                      )}`}
                    >
                      {getUserTypeText(item.userType)}
                    </div>
                    <div className="min-w-[120px] text-sm text-muted-foreground">
                      {item.createdAt.split(" ")[0]}
                    </div>
                    <div className="min-w-[120px] text-sm text-muted-foreground">
                      {item.updatedAt.split(" ")[0]}
                    </div>
                    <div
                      className={`min-w-[80px] text-sm font-medium ${
                        item.isActive ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.isActive ? "활성" : "비활성"}
                    </div>
                  </div>
                  <Menubar>
                    <MenubarMenu>
                      <MenubarTrigger className="cursor-pointer">
                        ⋯
                      </MenubarTrigger>
                      <MenubarContent>
                        <MenubarItem onClick={() => handleEdit(item)}>
                          수정
                        </MenubarItem>
                        <MenubarItem onClick={() => handleDelete(item.id)}>
                          삭제
                        </MenubarItem>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </div>
              ))
            )}
          </div>

          {/* 수정 Dialog */}
          {editingNotice && (
            <NoticeFormDialog
              trigger={<div style={{ display: "none" }} />}
              mode="edit"
              notice={editingNotice}
              open={isEditDialogOpen}
              onOpenChange={setIsEditDialogOpen}
              onSubmit={handleSubmitNotice}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
