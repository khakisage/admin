'use client'

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode } from "react";
import { Provider as JotaiProvider } from "jotai";

const queryClient = new QueryClient();

export function Providers({children}: {children: ReactNode}) {
    return (
        <JotaiProvider>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </JotaiProvider>
    )
}