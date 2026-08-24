import type { ActivityTypeTone, StatTone } from "./types"

export const CATEGORY_COLORS = {
  lifeSkills: "#3b82f6",
  economics: "#2dd4bf",
  literature: "#fbbf24",
  science: "#a78bfa",
  history: "#f472b6"
} as const

export type CategoryKey = keyof typeof CATEGORY_COLORS

export const ACTIVITY_TONE_STYLES: Record<ActivityTypeTone, string> = {
  green: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
  blue: "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400",
  amber: "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
  red: "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
}

export const STAT_TONE_STYLES: Record<
  StatTone,
  {
    container: string
    iconBg: string
    iconColor: string
    linkHover: string
  }
> = {
  blue: {
    container: "bg-blue-50/60 border-blue-100 dark:bg-blue-950/20 dark:border-blue-900/40",
    iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
    iconColor: "text-blue-600 dark:text-blue-400",
    linkHover: "text-blue-600 hover:text-blue-700 dark:text-blue-400"
  },
  amber: {
    container: "bg-amber-50/60 border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/40",
    iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/50 dark:text-amber-400",
    iconColor: "text-amber-600 dark:text-amber-400",
    linkHover: "text-amber-600 hover:text-amber-700 dark:text-amber-400"
  },
  red: {
    container: "bg-red-50/60 border-red-100 dark:bg-red-950/20 dark:border-red-900/40",
    iconBg: "bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400",
    iconColor: "text-red-600 dark:text-red-400",
    linkHover: "text-red-600 hover:text-red-700 dark:text-red-400"
  },
  green: {
    container:
      "bg-emerald-50/60 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40",
    iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/50 dark:text-emerald-400",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    linkHover: "text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
  }
}
