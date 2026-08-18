export interface NavItemType {
  id: string
  label: string
  icon: React.ReactNode
}

export interface StatItemType {
  id: string
  title: string
  value: string | number
  icon: React.ReactNode
  actionText: string
  colorClass: string
  textColorClass: string
}

export interface CategoryItemType {
  id: string
  title: string
  icon: React.ReactNode
  colorClass: string
  textColorClass: string
}
