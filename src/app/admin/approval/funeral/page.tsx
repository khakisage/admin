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

interface FuneralRequest {
  id: number;
  name: string;
  phone: string;
  funeralHall: string;
  address: string;
  createdAt: string;
  // TODO: API 도입 시 hasAttachments 필드로 변경
  // hasAttachments: boolean;
  images: string[];
  files: { name: string; url: string }[];
}

// TODO: API 도입 시 제거하고 useQuery로 대체
// const { data, isLoading, error } = useFuneralRequests()
const dummyData: FuneralRequest[] = [
  {
    id: 1,
    name: "김영희",
    phone: "010-1234-5678",
    funeralHall: "하늘장례식장",
    address: "서울시 강남구 테헤란로 123",
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
    name: "박철수",
    phone: "010-2345-6789",
    funeralHall: "평안장례식장",
    address: "서울시 서초구 서초대로 456",
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
  {
    id: 3,
    name: "이미영",
    phone: "010-3456-7890",
    funeralHall: "천국장례식장",
    address: "서울시 마포구 홍대로 789",
    createdAt: "2025-06-15",
    images: [
      "https://via.placeholder.com/400x300/8B5CF6/FFFFFF?text=사업자등록증",
      "https://via.placeholder.com/400x300/F59E0B/FFFFFF?text=신분증",
    ],
    files: [
      { name: "사업자등록증.pdf", url: "#" },
      { name: "신분증.jpg", url: "#" },
    ],
  },
];

const REJECT_REASONS = ["서류 미비", "정보 불일치", "연락 불가", "기타"];

export default function FuneralApprovalPage() {
  const [approvedList, setApprovedList] = useState<FuneralRequest[]>([]);
  const [requestList, setRequestList] = useState<FuneralRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rejectDialogId, setRejectDialogId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [dialogImages, setDialogImages] = useState<string[]>([]);
  const [fileLoading, setFileLoading] = useState(false);

  // API로 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await approvalAPI.getFuneralRequests();
        console.log("🚀 ~ fetchData ~ response:", response);

        // approved(승인됨), requests(대기중) 분리
        const approvedData = response.data?.approved?.map((item: any) => ({
          id: item.funeralId,
          name: item.funeralName,
          phone: item.funeralPhoneNumber,
          funeralHall: item.funeralHallName,
          address: item.address,
          createdAt: item.createdAt,
          images: item.fileUrl || [], // fileUrl을 images로 매핑
          files: [], // 필요시 파일 객체로 변환
        })) || [];

        const requestData = response.data?.requests?.map((item: any) => ({
          id: item.funeralId,
          name: item.funeralName,
          phone: item.funeralPhoneNumber,
          funeralHall: item.funeralHallName,
          address: item.address,
          createdAt: item.createdAt,
          images: item.fileUrl || [],
          files: [],
        })) || [];

        setApprovedList(approvedData);
        setRequestList(requestData);
      } catch (error) {
        console.error("장례식장 가입 요청 목록 조회 실패:", error);
        setError("장례식장 가입 요청 목록을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      await approvalAPI.setFuneralApproval(id, true);
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

  const handleReject = async (funeralId: string, reason: string) => {
    try {
      await approvalAPI.setFuneralApproval(funeralId, false, reason);
      // 추가적인 로직 (예: 상태 업데이트)
    } catch (error) {
      console.error("거절 처리 실패:", error);
    }
  };

  const handleRejectConfirm = async (id: number) => {
    try {
      await approvalAPI.setFuneralApproval(id, false, rejectReason);
      setRequestList((prev) => prev.filter((item) => item.id !== id));
      setRejectDialogId(null);
      setRejectReason("");
    } catch (error) {
      console.error("거절 처리 실패:", error);
    }
  };

  const handleOpenAttachment = (images: string[]) => {
    setDialogImages(images);
    setFileDialogOpen(true);
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>장례식장 가입 요청 목록</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto p-0">
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              가입 요청 목록을 불러오는 중입니다...
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-600">
              {error}
            </div>
          ) : (
            <>
              <h2 className="font-bold mb-2">가입 대기중인 장례식장</h2>
              {requestList.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  대기 중인 가입 요청이 없습니다.
                </div>
              ) : (
                <div className="p-6 space-y-4">
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
                        <div className="min-w-[150px] text-sm text-muted-foreground">
                          {item.funeralHall}
                        </div>
                        <div className="min-w-[200px] text-sm text-muted-foreground truncate">
                          {item.address}
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
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="거절 사유를 입력하세요"
                                    rows={3}
                                  />
                                  <Select onValueChange={(val) => setRejectReason(val)}>
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

              <h2 className="font-bold mt-8 mb-2">가입 승인된 장례식장</h2>
              {approvedList.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">
                  승인된 장례식장이 없습니다.
                </div>
              ) : (
                <div className="p-6 space-y-4">
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
                        <div className="min-w-[150px] text-sm text-muted-foreground">
                          {item.funeralHall}
                        </div>
                        <div className="min-w-[200px] text-sm text-muted-foreground truncate">
                          {item.address}
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
                            <AttachmentDialog
                              trigger={
                                <MenubarItem onSelect={(e) => e.preventDefault()}>
                                  첨부파일 보기
                                </MenubarItem>
                              }
                              images={item.images}
                              files={item.files}
                            />
                          </MenubarContent>
                        </MenubarMenu>
                      </Menubar>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      <AttachmentDialog
        open={fileDialogOpen}
        onOpenChange={setFileDialogOpen}
        images={dialogImages}
        files={[]}
        loading={false}
      />
    </div>
  );
}
