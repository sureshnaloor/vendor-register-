"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

export function ThemeSwitcher() {
    const [mounted, setMounted] = useState(false)
    const { theme, setTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button className="theme-toggle" aria-label="Toggle theme">
                <span className="icon-placeholder" />
            </button>
        )
    }

    return (
        <button
            className="theme-toggle"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
        >
            {theme === "dark" ? (
                <Moon className="theme-icon" size={20} />
            ) : (
                <Sun className="theme-icon" size={20} />
            )}
        </button>
    )
}
