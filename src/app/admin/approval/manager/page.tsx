"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
} from "@/components/ui/menubar";
import AttachmentDialog from "@/components/common/AttachmentDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useState } from "react";

interface ManagerRequest {
  id: number;
  name: string;
  phone: string;
  company: string;
  createdAt: string;
  // TODO: API 도입 시 hasAttachments 필드로 변경
  // hasAttachments: boolean;
  images: string[];
  files: { name: string; url: string }[];
}

// TODO: API 도입 시 제거하고 useQuery로 대체
// const { data, isLoading, error } = useManagerRequests()
const dummyData: ManagerRequest[] = [
  {
    id: 1,
    name: "홍길동",
    phone: "010-1234-5678",
    company: "하늘상조",
    createdAt: "2025-06-17",
    images: [
      "https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=사업자등록증",
      "https://via.placeholder.com/400x300/10B981/FFFFFF?text=신분증",
    ],
    files: [
      { name: "사업자등록증.pdf", url: "#" },
      { name: "신분증.jpg", url: "#" },
    ],
  },
  {
    id: 2,
    name: "김철수",
    phone: "010-2345-6789",
    company: "평안상조",
    createdAt: "2025-06-16",
    images: [
      "https://via.placeholder.com/400x300/EF4444/FFFFFF?text=사업자등록증",
    ],
    files: [
      { name: "사업자등록증.pdf", url: "#" },
      { name: "신분증.jpg", url: "#" },
      { name: "추가서류.docx", url: "#" },
    ],
  },
];

const REJECT_REASONS = ["서류 미비", "정보 불일치", "연락 불가", "기타"];

export default function ManagerApprovalPage() {
  // TODO: API 도입 시 useState 제거하고 useQuery 사용
  // const { data, isLoading, error } = useManagerRequests()
  // if (isLoading) return <LoadingSpinner />
  // if (error) return <ErrorMessage error={error} />
  const [data, setData] = useState(dummyData);
  const [rejectDialogId, setRejectDialogId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // TODO: API 도입 시 useMutation으로 변경
  // const approveMutation = useApproveManager()
  const handleApprove = (id: number) => {
    console.log(`승인 요청: ${id}`);
    // TODO: 승인 API 호출
    // approveMutation.mutate(id, {
    //   onSuccess: () => {
    //     queryClient.invalidateQueries(['manager-requests'])
    //   }
    // })
    // 승인 후 목록에서 제거
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  // TODO: API 도입 시 useMutation으로 변경
  // const rejectMutation = useRejectManager()
  const handleReject = (id: number) => {
    setRejectDialogId(id);
    setRejectReason("");
  };

  const handleRejectConfirm = (id: number) => {
    console.log(`거절 요청: ${id}, 사유: ${rejectReason}`);
    // TODO: 거절 API 호출 및 목록에서 제거
    setData((prev) => prev.filter((item) => item.id !== id));
    setRejectDialogId(null);
    setRejectReason("");
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>팀장 가입 요청 목록</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-0">
          {data.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              대기 중인 가입 요청이 없습니다.
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {data.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border p-4 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-8 flex-1">
                    <div className="min-w-[120px]">
                      <div className="font-semibold">{item.name}</div>
                    </div>
                    <div className="min-w-[150px] text-sm text-muted-foreground">
                      {item.phone}
                    </div>
                    <div className="min-w-[120px] text-sm text-muted-foreground">
                      {item.company}
                    </div>
                    <div className="min-w-[120px] text-xs text-gray-500">
                      {item.createdAt}
                    </div>
                  </div>
                  <Menubar>
                    <MenubarMenu>
                      <MenubarTrigger className="cursor-pointer">
                        ⋯
                      </MenubarTrigger>
                      <MenubarContent>
                        {/* TODO: API 도입 시 requestId와 requestType만 전달 */}
                        {/* <AttachmentDialog
                          trigger={
                            <MenubarItem onSelect={(e) => e.preventDefault()}>
                              첨부파일 보기
                            </MenubarItem>
                          }
                          requestId={item.id}
                          requestType="manager"
                        /> */}
                        <AttachmentDialog
                          trigger={
                            <MenubarItem onSelect={(e) => e.preventDefault()}>
                              첨부파일 보기
                            </MenubarItem>
                          }
                          images={item.images}
                          files={item.files}
                        />
                        <MenubarItem onClick={() => handleApprove(item.id)}>
                          승인
                        </MenubarItem>
                        <Dialog
                          open={rejectDialogId === item.id}
                          onOpenChange={(open) => {
                            if (!open) setRejectDialogId(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <MenubarItem
                              onSelect={(e) => {
                                e.preventDefault();
                                handleReject(item.id);
                              }}
                            >
                              거절
                            </MenubarItem>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>거절 사유 입력</DialogTitle>
                              <DialogDescription>
                                가입 요청을 거절하는 사유를 입력해 주세요.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-2 mt-4">
                              <Textarea
                                value={rejectReason}
                                onChange={(e) =>
                                  setRejectReason(e.target.value)
                                }
                                placeholder="거절 사유를 입력하세요"
                                rows={3}
                              />
                              <Select
                                onValueChange={(val) => setRejectReason(val)}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="자동완성 문구 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                  {REJECT_REASONS.map((reason) => (
                                    <SelectItem key={reason} value={reason}>
                                      {reason}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                              <button
                                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 border"
                                onClick={() => setRejectDialogId(null)}
                              >
                                취소
                              </button>
                              <button
                                className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700"
                                onClick={() => handleRejectConfirm(item.id)}
                                disabled={!rejectReason.trim()}
                              >
                                거절
                              </button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </MenubarContent>
                    </MenubarMenu>
                  </Menubar>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
