"use client"

import { useTheme } from "./theme-provider"
import { useEffect, useState } from "react"

export type ThemeColors = {
  primary: string
  secondary: string
  background: string
  foreground: string
  card: string
  cardForeground: string
  border: string
  input: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  success: string
  warning: string
  info: string
  surface: string
  surfaceElevated: string
  hover: string
  active: string
}

export type ThemeConfig = {
  theme: "dark" | "light" | "system"
  resolvedTheme: "dark" | "light"
  setTheme: (theme: "dark" | "light" | "system") => void
  colors: ThemeColors
  isDark: boolean
  isLight: boolean
  isSystem: boolean
}

export function useThemeConfig(): ThemeConfig {
  const { theme, setTheme } = useTheme()
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("light")
  const [colors, setColors] = useState<ThemeColors>({} as ThemeColors)

  useEffect(() => {
    const updateTheme = () => {
      const root = document.documentElement
      const computedStyle = getComputedStyle(root)
      
      // Determine the resolved theme
      let resolved: "dark" | "light" = "light"
      if (theme === "system") {
        resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      } else {
        resolved = theme as "dark" | "light"
      }
      
      setResolvedTheme(resolved)

      // Extract CSS custom properties
      const extractColor = (property: string) => {
        const value = computedStyle.getPropertyValue(property).trim()
        return value ? `hsl(${value})` : ""
      }

      setColors({
        primary: extractColor("--primary"),
        secondary: extractColor("--secondary"),
        background: extractColor("--background"),
        foreground: extractColor("--foreground"),
        card: extractColor("--card"),
        cardForeground: extractColor("--card-foreground"),
        border: extractColor("--border"),
        input: extractColor("--input"),
        muted: extractColor("--muted"),
        mutedForeground: extractColor("--muted-foreground"),
        accent: extractColor("--accent"),
        accentForeground: extractColor("--accent-foreground"),
        destructive: extractColor("--destructive"),
        destructiveForeground: extractColor("--destructive-foreground"),
        success: extractColor("--success"),
        warning: extractColor("--warning"),
        info: extractColor("--info"),
        surface: extractColor("--surface"),
        surfaceElevated: extractColor("--surface-elevated"),
        hover: extractColor("--hover"),
        active: extractColor("--active"),
      })
    }

    updateTheme()

    // Listen for theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => updateTheme()
    
    mediaQuery.addEventListener("change", handleChange)
    
    // Listen for manual theme changes
    const observer = new MutationObserver(() => updateTheme())
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    })

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
      observer.disconnect()
    }
  }, [theme])

  return {
    theme,
    resolvedTheme,
    setTheme,
    colors,
    isDark: resolvedTheme === "dark",
    isLight: resolvedTheme === "light",
    isSystem: theme === "system",
  }
}