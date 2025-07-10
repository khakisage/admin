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

import { useState, useEffect } from "react";
import { approvalAPI } from "@/lib/api";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

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
  const [approvedList, setApprovedList] = useState<ManagerRequest[]>([]);
  const [requestList, setRequestList] = useState<ManagerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectDialogId, setRejectDialogId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [fileData, setFileData] = useState<any>(null);
  const [fileLoading, setFileLoading] = useState(false);

  // API로 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await approvalAPI.getManagerRequests();
        console.log("🚀 ~ fetchData ~ response:", response);

        // approved(승인됨), requests(대기중) 분리
        const approvedData = response.data?.approved?.map((item: any) => ({
          id: item.managerId,
          name: item.managerName,
          phone: item.managerPhoneNumber,
          company: item.managerBankName, // 적절한 필드로 교체
          createdAt: item.createdAt,
          images: [],
          files: [],
        })) || [];

        const requestData = response.data?.requests?.map((item: any) => ({
          id: item.managerId,
          name: item.managerName,
          phone: item.managerPhoneNumber,
          company: item.managerBankName, // 적절한 필드로 교체
          createdAt: item.createdAt,
          images: [],
          files: [],
        })) || [];

        setApprovedList(approvedData);
        setRequestList(requestData);
      } catch (error) {
        console.error("팀장 가입 요청 목록 조회 실패:", error);
        setError("팀장 가입 요청 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await approvalAPI.setManagerApproval(id.toString(), true);
      setRequestList((prev) => prev.filter((item) => item.id !== id));
      // 승인된 요청을 approvedList로 이동
      const approvedItem = requestList.find((item) => item.id === id);
      if (approvedItem) {
        setApprovedList((prev) => [...prev, approvedItem]);
      }
    } catch (e) {
      alert("승인 처리에 실패했습니다.");
    }
  };

  // TODO: API 도입 시 useMutation으로 변경
  // const rejectMutation = useRejectManager()
  const handleReject = async (managerId: string, reason: string) => {
    try {
      await approvalAPI.setManagerApproval(managerId, false, reason);
      // 추가적인 로직 (예: 상태 업데이트)
    } catch (error) {
      console.error("거절 처리 실패:", error);
    }
  };

  const handleRejectConfirm = async (id: number) => {
    try {
      console.log("거절 사유:", rejectReason); // 실제 값 확인
      await approvalAPI.setManagerApproval(id.toString(), false, rejectReason);
      setRequestList((prev) => prev.filter((item) => item.id !== id));
      setRejectDialogId(null);
      setRejectReason("");
    } catch (e) {
      alert("거절 처리에 실패했습니다.");
    }
  };

  const handleOpenAttachment = async (managerId: string) => {
    setFileLoading(true);
    try {
      const res = await approvalAPI.getManagerFiles(managerId);
      setFileData(res.data); // 파일 데이터 저장
    } catch (e) {
      setFileData(null);
    } finally {
      setFileLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-muted-foreground">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>팀장 가입 요청 목록</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto py-4">
          <h2 className="font-bold mb-2">가입 대기중인 팀장</h2>
          {requestList.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              대기 중인 가입 요청이 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {requestList.map((item) => (
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
                      {format(new Date(item.createdAt), "yyyy년 MM월 dd일 a h시 mm분", { locale: ko })}
                    </div>
                  </div>
                  <Menubar>
                    <MenubarMenu>
                      <MenubarTrigger className="cursor-pointer">
                        ⋯
                      </MenubarTrigger>
                      <MenubarContent>
                        <AttachmentDialog
                          trigger={
                            <MenubarItem
                              onSelect={async (e) => {
                                e.preventDefault();
                                await handleOpenAttachment(item.id.toString());
                              }}
                            >
                              첨부파일 보기
                            </MenubarItem>
                          }
                          images={item.images}
                          files={fileData ? fileData.files : []}
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
                                setRejectDialogId(item.id); // Dialog만 오픈
                                setRejectReason(""); // 사유 초기화
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

          <h2 className="font-bold mt-8 mb-2">가입 승인된 팀장</h2>
          {approvedList.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              승인된 팀장이 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {approvedList.map((item) => (
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
                      {format(new Date(item.createdAt), "yyyy년 MM월 dd일 a h시 mm분", { locale: ko })}
                    </div>
                  </div>
                  <Menubar>
                    <MenubarMenu>
                      <MenubarTrigger className="cursor-pointer">
                        ⋯
                      </MenubarTrigger>
                      <MenubarContent>
                        <AttachmentDialog
                          trigger={
                            <MenubarItem
                              onSelect={async (e) => {
                                e.preventDefault();
                                await handleOpenAttachment(item.id.toString());
                              }}
                            >
                              첨부파일 보기
                            </MenubarItem>
                          }
                          images={item.images}
                          files={fileData ? fileData.files : []}
                        />
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
