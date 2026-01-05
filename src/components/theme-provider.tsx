"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

// Since we are using vanilla CSS variables, we don't strictly need 'attribute="class"'.
// However, using 'attribute="data-theme"' is very common for CSS variable switching.
// Let's use 'data-theme' so our CSS can use [data-theme='dark'].
export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
