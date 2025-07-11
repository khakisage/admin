"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import { useState, useEffect } from "react";
import { noticeAPI } from "@/lib/api"; // 상단에 import 추가

interface Notice {
  id: number;
  title: string;
  content: string;
  userType: "manager" | "funeral" | "all";
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

interface NoticeFormDialogProps {
  trigger: React.ReactNode;
  mode: "create" | "edit";
  notice?: Notice; // 수정 모드일 때만 전달
  open?: boolean; // 외부에서 제어할 때 사용
  onOpenChange?: (open: boolean) => void; // 외부에서 제어할 때 사용
  onSubmit: (data: {
    id?: number;
    title: string;
    content: string;
    userType: "manager" | "funeral" | "all";
    isActive: boolean;
  }) => void;
}

export default function NoticeFormDialog({
  trigger,
  mode,
  notice,
  open: externalOpen,
  onOpenChange: externalOnOpenChange,
  onSubmit,
}: NoticeFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [userType, setUserType] = useState<"manager" | "funeral" | "all">(
    "all"
  );
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 외부 제어 또는 내부 제어 결정
  const isControlled = externalOpen !== undefined;
  const open = isControlled ? externalOpen : internalOpen;
  const setOpen = isControlled
    ? externalOnOpenChange || (() => {})
    : setInternalOpen;

  // 수정 모드일 때 기존 데이터로 초기화
  useEffect(() => {
    if (mode === "edit" && notice) {
      setTitle(notice.title);
      setContent(notice.content);
      setUserType(notice.userType);
      setIsActive(notice.isActive);
    } else {
      // 신규 등록 모드일 때 초기화
      setTitle("");
      setContent("");
      setUserType("all");
      setIsActive(true);
    }
  }, [mode, notice, open]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("제목을 입력해주세요.");
      return;
    }
    if (!content.trim()) {
      toast.error("내용을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "create") {
        // 등록 API 호출
        await noticeAPI.createNotice({
          title: title.trim(),
          content: content.trim(),
          userType,
          isActive,
        });
        toast.success("공지사항이 등록되었습니다.");
      } else {
        // 수정 API 호출
        await noticeAPI.updateNotice({
          id: notice?.id as string, // UUID
          title: title.trim(),
          content: content.trim(),
          isActive,
        });
        toast.success("공지사항이 수정되었습니다.");
      }

      setOpen(false);
      setTitle("");
      setContent("");
      setUserType("all");
      setIsActive(true);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "공지사항 저장에 실패했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Dialog가 닫힐 때 폼 초기화
    setOpen(false);
    setTitle("");
    setContent("");
    setUserType("all");
    setIsActive(true);
  };

  const dialogTitle = mode === "create" ? "공지사항 등록" : "공지사항 수정";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* 제목 입력 */}
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              placeholder="공지사항 제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* 내용 입력 */}
          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              placeholder="공지사항 내용을 입력하세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              className="resize-none"
            />
          </div>

          {/* 유저 타입 선택 */}
          <div className="space-y-2">
            <Label htmlFor="userType">대상 유저</Label>
            <Select
              value={userType}
              onValueChange={(value: "manager" | "funeral" | "all") =>
                setUserType(value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="대상 유저를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="manager">상조팀장</SelectItem>
                <SelectItem value="funeral">장례식장</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 활성 여부 (수정 모드에서만 표시) */}
          {mode === "edit" && (
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="isActive">활성 상태</Label>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" className="flex-1" onClick={handleClose}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="flex-1"
          >
            {isSubmitting
              ? "처리중..."
              : mode === "create"
              ? "등록하기"
              : "수정하기"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
