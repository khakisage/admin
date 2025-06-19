"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import { useState } from "react";

interface PointIssueDialogProps {
  trigger: React.ReactNode;
  memberId: number;
  memberName: string;
  memberType: "manager" | "funeral";
  company: string;
  onIssue: (data: {
    memberId: number;
    amount: number;
    reason: string;
    type: "point" | "cash";
  }) => void;
}

export default function PointIssueDialog({
  trigger,
  memberId,
  memberName,
  memberType,
  company,
  onIssue,
}: PointIssueDialogProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [type, setType] = useState<"point" | "cash">("point");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!amount || !reason) {
      toast.error("금액과 사유를 모두 입력해주세요.");
      return;
    }

    const numAmount = parseInt(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("올바른 금액을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onIssue({
        memberId,
        amount: numAmount,
        reason,
        type,
      });

      // 성공 시 Dialog 닫기 및 폼 초기화
      setOpen(false);
      setAmount("");
      setReason("");
      setType("point");
    } catch (error) {
      console.error("포인트 지급 실패:", error);
      toast.error("포인트 지급 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Dialog가 닫힐 때 폼 초기화
    setOpen(false);
    setAmount("");
    setReason("");
    setType("point");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={() => setOpen(true)}>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>포인트/캐시 지급</DialogTitle>
          <DialogDescription>
            {memberName} ({memberType === "manager" ? "상조팀장" : "장례식장"})
            - {company}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* 지급 유형 선택 */}
          <div className="space-y-2">
            <Label htmlFor="type">지급 유형</Label>
            <Select
              value={type}
              onValueChange={(value: "point" | "cash") => setType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="지급 유형을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="point">포인트</SelectItem>
                <SelectItem value="cash">캐시</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 금액 입력 */}
          <div className="space-y-2">
            <Label htmlFor="amount">지급 금액</Label>
            <div className="relative">
              <Input
                id="amount"
                type="number"
                placeholder="지급할 금액을 입력하세요"
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setAmount(e.target.value)
                }
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                원
              </span>
            </div>
          </div>

          {/* 지급 사유 */}
          <div className="space-y-2">
            <Label htmlFor="reason">지급 사유</Label>
            <Input
              id="reason"
              placeholder="지급 사유를 입력하세요"
              value={reason}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setReason(e.target.value)
              }
            />
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" className="flex-1" onClick={handleClose}>
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !amount || !reason}
            className="flex-1"
          >
            {isSubmitting ? "처리중..." : "지급하기"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
