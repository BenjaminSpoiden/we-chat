"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react";
import React from "react"

export const Providers = ({children}: React.PropsWithChildren) => {
    const queryClientConfig = {
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
                staleTime: 1000 * 60 * 5
            },
        }
    };
    const [queryClient] = React.useState(() => new QueryClient(queryClientConfig))
    return (
        <QueryClientProvider client={queryClient}>
            <SessionProvider>
                {children}
            </SessionProvider>
        </QueryClientProvider>
    )
}