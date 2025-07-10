'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react";
import { Provider as JotaiProvider } from "jotai";
import { FCMProvider } from "./FCMProvider";

console.log('🔴 providers.tsx 파일 로드됨');

const queryClient = new QueryClient();

export function Providers({children}: {children: ReactNode}) {
    console.log('🟢 Providers 컴포넌트 렌더링됨');
    return (
        <JotaiProvider>
            <QueryClientProvider client={queryClient}>
                <FCMProvider>
                    {children}
                </FCMProvider>
            </QueryClientProvider>
        </JotaiProvider>
    )
}