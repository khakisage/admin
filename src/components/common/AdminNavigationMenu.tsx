"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Coins,
  Bell,
  Building2,
  History,
  Settings,
  UserPlus,
  Store,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { notificationApiService } from "@/lib/api";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const approvalItems = [
  {
    title: "팀장 가입 요청",
    href: "/admin/approval/manager",
    description: "팀장 가입 요청 리스트를 관리합니다.",
    icon: UserPlus,
  },
  {
    title: "장례식장 가입 요청",
    href: "/admin/approval/funeral",
    description: "장례식장 가입 요청 리스트를 관리합니다.",
    icon: Building2,
  },
];

const pointItems = [
  {
    title: "캐시 지급 페이지",
    href: "/admin/point-cash/issue",
    description: "캐시를 지급합니다.",
    icon: Coins,
  },
  {
    title: "캐시 충전 내역",
    href: "/admin/point-cash/charge-history",
    description: "캐시 충전 내역을 확인합니다.",
    icon: History,
  },
  {
    title: "환급 신청 목록",
    href: "/admin/point-cash/refund-request",
    description: "환급 신청 목록을 확인합니다.",
    icon: Settings,
  },
  {
    title: "캐시 환급 내역",
    href: "/admin/point-cash/refund-history",
    description: "캐시 환급 내역을 확인합니다.",
    icon: History,
  },
];

// const dispatchItems = [
//   {
//     title: "전체 출동 내역",
//     href: "/admin/dispatch/history",
//     description: "전체 출동 내역을 확인합니다.",
//     icon: Calendar,
//   },
//   {
//     title: "전체 거래 내역",
//     href: "/admin/transactions/history",
//     description: "전체 거래 내역을 확인합니다.",
//     icon: FileText,
//   },
// ];

const memberItems = [
  {
    title: "상조팀장 유저 목록",
    href: "/admin/members/companies",
    description: "상조팀장 유저 목록을 관리합니다.",
    icon: Users,
  },
  {
    title: "장례식장 유저 목록",
    href: "/admin/members/funeral-halls",
    description: "장례식장 유저 목록을 관리합니다.",
    icon: Store,
  },
];

const noticeItems = [
  {
    title: "공지사항 관리",
    href: "/admin/notices",
    description: "공지사항 등록, 수정, 삭제를 할 수 있습니다.",
    icon: Bell,
  },
];

export const AdminNavigationMenu = () => {
  const router = useRouter();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // 읽지 않은 알림 개수 조회
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response =
          await notificationApiService.getUnreadNotificationCount();
        console.log("🚀 ~ fetchUnreadCount ~ response:", response);
        setUnreadCount(response.count || 0);
      } catch (error) {
        console.error("읽지 않은 알림 개수 조회 실패:", error);
      }
    };

    fetchUnreadCount();

    // 30초마다 읽지 않은 알림 개수 업데이트
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    toast.success("로그아웃되었습니다.");
    router.push("/");
  };

  return (
    <div className="flex items-center gap-12">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>가입 승인</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-2 p-4">
                {approvalItems.map((item) => (
                  <ListItem
                    key={item.title}
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>캐시 관리</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[500px] gap-2 p-4 md:grid-cols-2">
                {pointItems.map((item) => (
                  <ListItem
                    key={item.title}
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          {/* 
          <NavigationMenuItem>
            <NavigationMenuTrigger>출동/거래내역</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-2 p-4">
                {dispatchItems.map((item) => (
                  <ListItem
                    key={item.title}
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem> */}

          <NavigationMenuItem>
            <NavigationMenuTrigger>회원 관리</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-2 p-4">
                {memberItems.map((item) => (
                  <ListItem
                    key={item.title}
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>공지사항</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-2 p-4">
                {noticeItems.map((item) => (
                  <ListItem
                    key={item.title}
                    title={item.title}
                    href={item.href}
                    icon={item.icon}
                  >
                    {item.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink asChild>
              <Link
                href="/admin/notifications"
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50"
              >
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  알림 관리
                  {unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-1 px-1.5 py-0.5 text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </div>
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      {/* 로그아웃 버튼 */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        로그아웃
      </Button>
    </div>
  );
};

function ListItem({
  title,
  children,
  href,
  icon: Icon,
  ...props
}: React.ComponentPropsWithoutRef<"li"> & {
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <li {...props}>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
        >
          <div className="flex items-center gap-2 text-sm font-medium leading-none">
            {Icon && <Icon className="h-4 w-4" />}
            {title}
          </div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
}
