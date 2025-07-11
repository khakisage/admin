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

import { useEffect, useState } from "react";
import { noticeAPI } from "@/lib/api"; // 위에서 추가한 API import
import { useNoticeList } from "@/lib/server-state/query";
import { useCreateNotice, useUpdateNotice } from "@/lib/server-state/mutation";
import { INotice } from "@/lib/types/interface";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

interface Notice {
  id: string; // UUID
  title: string;
  content: string;
  userType: "manager" | "funeral" | "all";
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export default function NoticesPage() {
  const [data, setData] = useState<Notice[]>([]);
  const [userTypeFilter, setUserTypeFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // 공지사항 목록 조회
  const {data: notices = []} = useNoticeList(userTypeFilter === 'all' ? undefined : userTypeFilter);
  
  // 공지사항 등록
  const createNotice = useCreateNotice();
  // 공지사항 수정
  const updateNotice = useUpdateNotice();
  
  // console.log('🚀 ~ NoticesPage ~ notices:', notices)
  // const fetchNotices = () => {
  //   noticeAPI
  //     .getNoticeList({ userType: userTypeFilter === "all" ? undefined : userTypeFilter })
  //     .then((res) => {
  //       const notices = res.data.map((item: any) => ({
  //         id: item.noticeId,
  //         title: item.title,
  //         content: item.content,
  //         userType: item.userType,
  //         createdAt: item.createdAt.replace("T", " ").slice(0, 19),
  //         updatedAt: item.updatedAt.replace("T", " ").slice(0, 19),
  //         isActive: item.isVisible,
  //       }));
  //       setData(notices);
  //     })
  //     .catch(() => setData([]));
  // };

  // useEffect(() => {
  //   fetchNotices();
  // }, [userTypeFilter]);

  // 필터링 및 정렬 로직
  const filteredAndSortedData = notices
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

  const handleDelete = (id: string) => {
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
    id?: string;
    title: string;
    content: string;
    userType: "manager" | "funeral" | "all";
    isActive: boolean;
  }) => {
    try {
      if (data.id) {
        await updateNotice.mutateAsync({
          id: data.id,
          title: data.title,
          content: data.content,
          isActive: data.isActive,
        });
        toast.success("공지사항이 수정되었습니다.");
      } else {
        await createNotice.mutateAsync({
          title: data.title,
          content: data.content,
          userType: data.userType,
          isActive: data.isActive,
        });
        toast.success("공지사항이 등록되었습니다.");
      }
      setIsEditDialogOpen(false);
      setEditingNotice(null);
      //   // 수정 로직
      //   setData((prev) =>
      //     prev.map((item) =>
      //       item.id === data.id
      //         ? {
      //             ...item,
      //             title: data.title,
      //             content: data.content,
      //             userType: data.userType,
      //             isActive: data.isActive,
      //             updatedAt: new Date()
      //               .toISOString()
      //               .replace("T", " ")
      //               .slice(0, 19),
      //           }
      //         : item
      //     )
      //   );
      //   toast.success("공지사항이 수정되었습니다.");
      //   fetchNotices(); // 목록 갱신!
      //   setIsEditDialogOpen(false);
      //   setEditingNotice(null);
      // } else {
      //   // 신규 등록 로직
      //   const newNotice: Notice = {
      //     id: Math.max(...data.map((item: Notice) => item.id)) + 1,
      //     title: data.title,
      //     content: data.content,
      //     userType: data.userType,
      //     isActive: data.isActive,
      //     createdAt: new Date().toISOString().replace("T", " ").slice(0, 19),
      //     updatedAt: new Date().toISOString().replace("T", " ").slice(0, 19),
      //   };
      //   setData((prev) => [newNotice, ...prev]);
      //   fetchNotices(); // 목록 갱신!
      //   toast.success("공지사항이 등록되었습니다.");

      
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
                onSubmit={(data) => {
                  const { id, ...rest } = data;
                  handleSubmitNotice({
                    ...rest,
                    id: id?.toString()
                  });
                }}
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
              filteredAndSortedData.map((item: INotice) => (
                <div
                  key={item.noticeId}
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
                      {format(new Date(item.createdAt), "yyyy년 MM월 dd일", { locale: ko })}
                    </div>
                    {/* <div className="min-w-[120px] text-sm text-muted-foreground">
                      {format(new Date(item.updatedAt), "yyyy년 MM월 dd일", { locale: ko })}
                    </div> */}
                    <div
                      className={`min-w-[80px] text-sm font-medium ${
                        item.isVisible ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.isVisible ? "활성" : "비활성"}
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
