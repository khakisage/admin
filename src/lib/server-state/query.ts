import { useQuery } from '@tanstack/react-query';
import { noticeAPI, approvalAPI, userAPI, cashAPI, dispatchAPI } from '../api';
import { INoticeList } from '../types/interface';

// 공지사항 목록 조회
export const useNoticeList = (userType?: string, isVisible?: boolean) =>
  useQuery({
    queryKey: ['notices', userType, isVisible],
    queryFn: () => noticeAPI.getNoticeList({ userType, isVisible }),
    select: (data) => data.data as INoticeList,
  });

// 장례식장 가입 요청 목록
export const useFuneralRequests = () =>
  useQuery({
    queryKey: ['funeralRequests'],
    queryFn: approvalAPI.getFuneralRequests,
  });

// 상조팀장 가입 요청 목록
export const useManagerRequests = () =>
  useQuery({
    queryKey: ['managerRequests'],
    queryFn: approvalAPI.getManagerRequests,
  });

// 상조팀장 유저 목록
export const useManagerList = () =>
  useQuery({
    queryKey: ['managerList'],
    queryFn: userAPI.getManagerList,
  });

// 장례식장 유저 목록
export const useFuneralList = () =>
  useQuery({
    queryKey: ['funeralList'],
    queryFn: userAPI.getFuneralList,
  });

// 전체 유저 목록
export const useUserList = () =>
  useQuery({
    queryKey: ['userList'],
    queryFn: userAPI.getUserList,
  });

// 특정 유저 상세
export const useUserDetail = (userId: string, userType: string) =>
  useQuery({
    queryKey: ['userDetail', userId, userType],
    queryFn: () => userAPI.getUserDetail(userId, userType),
    enabled: !!userId && !!userType,
  });

// 특정 유저의 환급 신청 내역
export const useRefundRequestByUserId = (userId: string, type: string) =>
  useQuery({
    queryKey: ['refundRequest', userId, type],
    queryFn: () => cashAPI.getRefundRequestByUserId(userId, type),
    enabled: !!userId && !!type,
  });

// 특정 유저의 승인된 환급 신청 내역
export const useApprovedRefundRequestsByUserId = (userId: string, type: string) =>
  useQuery({
    queryKey: ['approvedRefundRequest', userId, type],
    queryFn: () => cashAPI.getApprovedRefundRequestsByUserId(userId, type),
    enabled: !!userId && !!type,
  });

// 전체 캐시 충전 내역
export const useAllCashChargeHistory = () =>
  useQuery({
    queryKey: ['allCashChargeHistory'],
    queryFn: cashAPI.getAllCashChargeHistory,
  });

// 전체 환급 요청 내역
export const useAllRefundRequests = (type: string = 'all') =>
  useQuery({
    queryKey: ['allRefundRequests', type],
    queryFn: () => cashAPI.getAllRefundRequests(type),
  });

// 전체 환급 처리 내역
export const useRefundHistory = (type: string = 'all') =>
  useQuery({
    queryKey: ['refundHistory', type],
    queryFn: () => cashAPI.getRefundHistory(type),
  });

// 특정 상조팀장의 캐시 충전 내역
export const useManagerCashChargeHistoryById = (memberId: string, memberType: string) =>
  useQuery({
    queryKey: ['managerCashChargeHistory', memberId, memberType],
    queryFn: () => cashAPI.getManagerCashChargeHistoryById(memberId, memberType),
    enabled: !!memberId && !!memberType,
  });

// 출동 요청 내역 (특정 유저)
export const useDispatchRequestsByUser = (userId: string, userType: string) =>
  useQuery({
    queryKey: ['dispatchRequests', userId, userType],
    queryFn: () => dispatchAPI.getDispatchRequestsByUser(userId, userType),
    enabled: !!userId && !!userType,
  }); 