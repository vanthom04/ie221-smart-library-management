export const CATEGORY_COLORS = {
  lifeSkills: "#3b82f6",
  economics: "#2dd4bf",
  literature: "#fbbf24",
  science: "#a78bfa",
  history: "#f472b6"
} as const

export type CategoryKey = keyof typeof CATEGORY_COLORS