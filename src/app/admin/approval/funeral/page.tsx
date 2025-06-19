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

import { useState } from "react";

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

export default function FuneralApprovalPage() {
  // TODO: API 도입 시 useState 제거하고 useQuery 사용
  // const { data, isLoading, error } = useFuneralRequests()
  // if (isLoading) return <LoadingSpinner />
  // if (error) return <ErrorMessage error={error} />
  const [data, setData] = useState(dummyData);

  // TODO: API 도입 시 useMutation으로 변경
  // const approveMutation = useApproveFuneral()
  const handleApprove = (id: number) => {
    console.log(`승인 요청: ${id}`);
    // TODO: 승인 API 호출
    // approveMutation.mutate(id, {
    //   onSuccess: () => {
    //     queryClient.invalidateQueries(['funeral-requests'])
    //   }
    // })
    // 승인 후 목록에서 제거
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  // TODO: API 도입 시 useMutation으로 변경
  // const rejectMutation = useRejectFuneral()
  const handleReject = (id: number) => {
    console.log(`거절 요청: ${id}`);
    // TODO: 거절 API 호출
    // rejectMutation.mutate(id, {
    //   onSuccess: () => {
    //     queryClient.invalidateQueries(['funeral-requests'])
    //   }
    // })
    // 거절 후 목록에서 제거
    setData((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full h-[calc(100vh-4rem)] flex flex-col">
      <Card className="w-full h-full flex flex-col">
        <CardHeader className="flex-shrink-0">
          <CardTitle>장례식장 가입 요청 목록</CardTitle>
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
                        {/* TODO: API 도입 시 requestId와 requestType만 전달 */}
                        {/* <AttachmentDialog
                          trigger={
                            <MenubarItem onSelect={(e) => e.preventDefault()}>
                              첨부파일 보기
                            </MenubarItem>
                          }
                          requestId={item.id}
                          requestType="funeral"
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
                        <MenubarItem onClick={() => handleReject(item.id)}>
                          거절
                        </MenubarItem>
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
