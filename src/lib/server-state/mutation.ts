import { useMutation, useQueryClient } from '@tanstack/react-query';
import { noticeAPI, approvalAPI, cashAPI } from '../api';

// 공지사항 등록
export const useCreateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: noticeAPI.createNotice,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['notices'], exact: false });
    },
  });
};

// 공지사항 수정
export const useUpdateNotice = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: noticeAPI.updateNotice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'], exact: false });
    },
  });
};

// 장례식장 가입 승인/거절
export const useSetFuneralApproval = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ funeralId, isApproved, rejectReason }: { funeralId: string, isApproved: boolean, rejectReason?: string }) =>
      approvalAPI.setFuneralApproval(funeralId, isApproved, rejectReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funeralRequests'] });
    },
  });
};

// 상조팀장 가입 승인/거절
export const useSetManagerApproval = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ managerId, isApproved, rejectReason }: { managerId: string, isApproved: boolean, rejectReason?: string }) =>
      approvalAPI.setManagerApproval(managerId, isApproved, rejectReason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['managerRequests'] });
    },
  });
};

// 환급 승인/거절 처리
export const useProcessRefundApproval = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cashAPI.processRefundApproval,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allRefundRequests'] });
      queryClient.invalidateQueries({ queryKey: ['refundHistory'] });
    },
  });
};

// 캐시 지급(충전)
export const useAddCashToUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, amount, userType }: { userId: number, amount: number, userType: string }) =>
      cashAPI.addCashToUser(userId, amount, userType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allCashChargeHistory'] });
    },
  });
}; 