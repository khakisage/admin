"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Bell, Mail, MailOpen, CheckCheck, Eye } from "lucide-react";
import { toast } from "sonner";
import { notificationApiService, NotificationItem } from "@/lib/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<UnreadNotificationRow[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // 알림 목록 조회
  const fetchNotifications = async (page = 1, type?: string) => {
    try {
      setLoading(true);
      const response = await notificationApiService.getNotificationList({
        page,
        limit: 20,
        type: type === "all" ? undefined : type,
      });
      console.log("🚀 ~ fetchNotifications ~ response:", response);
      setNotifications(response.rows);
      setTotalCount(response.count);
      // setUnreadCount(response.count);
      setUnreadCount(response.rows.filter((item) => !item.isRead).length);
    } catch (error) {
      console.error("알림 목록 조회 실패:", error);
      toast.error("알림 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 알림 읽음 처리
  const markAsRead = async (notificationId: string) => {
    try {
      await notificationApiService.markAsRead(notificationId);
      toast.success("알림을 읽음으로 처리했습니다.");

      // 로컬 상태 업데이트
      setNotifications((prev) =>
        prev.map((item) =>
          item.id === notificationId ? { ...item, isRead: true } : item
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
      toast.error("알림 읽음 처리에 실패했습니다.");
    }
  };

  // 모든 알림 읽음 처리
  const markAllAsRead = async () => {
    try {
      await notificationApiService.markAllAsRead();
      toast.success("모든 알림을 읽음으로 처리했습니다.");

      // 로컬 상태 업데이트
      setNotifications((prev) =>
        prev.map((item) => ({ ...item, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("모든 알림 읽음 처리 실패:", error);
      toast.error("모든 알림 읽음 처리에 실패했습니다.");
    }
  };

  // 초기 로딩
  useEffect(() => {
    fetchNotifications(1, activeTab);
  }, [activeTab]);

  // 탭 변경 핸들러
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCurrentPage(1);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchNotifications(page, activeTab);
  };

  // 알림 타입별 배지 스타일
  const getTypeBadge = (type: string) => {
    const typeMap: Record<
      string,
      {
        label: string;
        variant: "default" | "secondary" | "destructive" | "outline";
      }
    > = {
      system: { label: "시스템", variant: "default" },
      approval: { label: "승인", variant: "secondary" },
      payment: { label: "결제", variant: "outline" },
      notice: { label: "공지", variant: "destructive" },
    };

    const config = typeMap[type] || { label: type, variant: "default" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "방금 전";
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInHours < 48) {
      return "1일 전";
    } else {
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };
  console.log(
    "🚀 ~ NotificationsPage ~ notifications:",
    totalCount,
    unreadCount
  );

  // 필터링된 알림 목록
  const filteredNotifications = notifications.filter((notification) => {
    if (activeTab === "unread") return !notification.isRead;
    return true;
  });

  return (
    <div className="container mx-auto p-6 space-y-6 bg-white">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold">알림 관리</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => fetchNotifications(currentPage, activeTab)}
            disabled={loading}
          >
            새로고침
          </Button>
          {unreadCount > 0 && (
            <Button
              onClick={markAllAsRead}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <CheckCheck className="h-4 w-4" />
              모두 읽음
            </Button>
          )}
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체 알림</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
            <p className="text-xs text-muted-foreground">총 알림 개수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">읽지 않음</CardTitle>
            <MailOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {unreadCount}
            </div>
            <p className="text-xs text-muted-foreground">읽지 않은 알림</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">읽음</CardTitle>
            <CheckCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalCount - unreadCount}
            </div>
            <p className="text-xs text-muted-foreground">읽은 알림</p>
          </CardContent>
        </Card>
      </div>

      {/* 필터링 탭 */}
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="unread">읽지 않음 ({unreadCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {loading ? (
                // 로딩 스켈레톤
                Array.from({ length: 5 }).map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-3 w-[200px]" />
                          <div className="flex gap-2">
                            <Skeleton className="h-6 w-16" />
                            <Skeleton className="h-6 w-16" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-[80px]" />
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">알림이 없습니다.</p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`transition-colors hover:bg-muted/50 ${
                      !notification.isRead
                        ? "border-l-4 border-l-blue-500 bg-blue-50/50"
                        : ""
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h3
                              className={`font-medium ${
                                !notification.isRead ? "font-semibold" : ""
                              }`}
                            >
                              {notification.title}
                            </h3>
                            {!notification.isRead && (
                              <Badge
                                variant="destructive"
                                className="px-1.5 py-0.5 text-xs"
                              >
                                NEW
                              </Badge>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {notification.body}
                          </p>

                          <div className="flex items-center gap-2">
                            {getTypeBadge(notification.type)}
                            <Badge
                              variant={
                                notification.isRead ? "secondary" : "outline"
                              }
                            >
                              {notification.isRead ? "읽음" : "읽지 않음"}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(notification.createdAt)}
                          </span>

                          <div className="flex gap-1">
                            {/* 상세보기 다이얼로그 */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Eye className="h-3 w-3" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    {notification.title}
                                  </DialogTitle>
                                  <DialogDescription>
                                    {formatDate(notification.createdAt)} •{" "}
                                    {getTypeBadge(notification.type)}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p className="text-sm">{notification.body}</p>
                                  {notification.data &&
                                    Object.keys(notification.data).length >
                                      0 && (
                                      <div className="space-y-2">
                                        <h4 className="text-sm font-medium">
                                          추가 정보
                                        </h4>
                                        <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                                          {JSON.stringify(
                                            notification.data,
                                            null,
                                            2
                                          )}
                                        </pre>
                                      </div>
                                    )}
                                </div>
                              </DialogContent>
                            </Dialog>

                            {!notification.isRead && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  markAsRead(notification.notificationId)
                                }
                                className="flex items-center gap-1"
                              >
                                <CheckCheck className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              >
                이전
              </Button>

              <span className="text-sm text-muted-foreground">
                {currentPage} / {totalPages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              >
                다음
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
