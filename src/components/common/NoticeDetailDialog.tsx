"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INotice } from "@/lib/types/interface";

interface NoticeDetailDialogProps {
  trigger: React.ReactNode;
  notice: INotice;
}

export default function NoticeDetailDialog({
  trigger,
  notice,
}: NoticeDetailDialogProps) {
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
        return "bg-blue-100 text-blue-800";
      case "funeral":
        return "bg-green-100 text-green-800";
      case "all":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isEdited = notice.createdAt !== notice.updatedAt;

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <DialogTitle className="text-xl">{notice.title}</DialogTitle>
            <Badge className={getStatusColor(notice.isVisible)}>
              {notice.isVisible ? "활성" : "비활성"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getUserTypeColor(notice.userType)}>
              {getUserTypeText(notice.userType)}
            </Badge>
            <span className="text-sm text-muted-foreground">
              작성일: {formatDate(notice.createdAt)}
            </span>
            {isEdited && (
              <span className="text-sm text-muted-foreground">
                수정일: {formatDate(notice.updatedAt)}
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="mt-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {notice.content}
            </div>
          </div>
        </div>

        <DialogClose asChild>
          <Button className="mt-6 w-full" variant="secondary">
            닫기
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
