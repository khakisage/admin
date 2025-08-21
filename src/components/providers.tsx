'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react";
import { Provider as JotaiProvider } from "jotai";
import { FCMProvider } from "./FCMProvider";
import { usePathname } from "next/navigation";

// console.log('🔴 providers.tsx 파일 로드됨');

const queryClient = new QueryClient();

export function Providers({children}: {children: ReactNode}) {
    const pathname = usePathname();
    
    // 로그인 페이지에서는 FCMProvider 제외
    const isLoginPage = pathname?.startsWith('/auth/admin/login');
    
    // console.log('🟢 Providers 컴포넌트 렌더링됨');
    return (
        <JotaiProvider>
            <QueryClientProvider client={queryClient}>
                {!isLoginPage && <FCMProvider>{children}</FCMProvider>}
                {isLoginPage && children}
            </QueryClientProvider>
        </JotaiProvider>
    )
}