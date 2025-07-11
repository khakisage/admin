export interface INotice {
    noticeId: string;
    content: string;
    createdAt: string;
    isVisible: boolean;
    title: string;
    updatedAt: string;
    userType: 'manager' | 'funeral' | 'all';
}

export type INoticeList = INotice[];