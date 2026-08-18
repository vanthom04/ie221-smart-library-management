"use client"

import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TabData {
  label: string
  value: string
  content: React.ReactNode
}

interface VercelTabsProps {
  tabs: TabData[]
  defaultTab?: string
  className?: string
}

export function VercelTabs({ tabs, defaultTab, className }: VercelTabsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.value)
  const [hoverStyle, setHoverStyle] = useState({})
  const [activeStyle, setActiveStyle] = useState({ left: "0px", width: "0px" })
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const activeIndex = tabs.findIndex((tab) => tab.value === activeTab)

  useEffect(() => {
    if (hoveredIndex !== null) {
      const hoveredElement = tabRefs.current[hoveredIndex]
      if (hoveredElement) {
        const { offsetLeft, offsetWidth } = hoveredElement
        setHoverStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`
        })
      }
    }
  }, [hoveredIndex])

  useEffect(() => {
    const activeElement = tabRefs.current[activeIndex]
    if (activeElement) {
      const { offsetLeft, offsetWidth } = activeElement
      setActiveStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`
      })
    }
  }, [activeIndex])

  useEffect(() => {
    requestAnimationFrame(() => {
      const activeElement = tabRefs.current[activeIndex]
      if (activeElement) {
        const { offsetLeft, offsetWidth } = activeElement
        setActiveStyle({
          left: `${offsetLeft}px`,
          width: `${offsetWidth}px`
        })
      }
    })
  }, [activeIndex])

  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={setActiveTab}
      className={cn("flex w-full flex-col items-center", className)}
    >
      <TabsList className="relative h-auto gap-1.5 bg-transparent p-0 select-none">
        {/* Hover Highlight */}
        <div
          className="absolute top-0 left-0 flex h-7.5 items-center rounded-[6px] bg-[#0e0f1114] transition-all duration-300 ease-out dark:bg-[#ffffff1a]"
          style={{
            ...hoverStyle,
            opacity: hoveredIndex !== null ? 1 : 0
          }}
        />

        {/* Active Indicator */}
        <div
          className="absolute -bottom-1.5 h-0.5 bg-[#0e0f11] transition-all duration-300 ease-out dark:bg-white"
          style={activeStyle}
        />

        {tabs.map((tab, index) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            ref={(el) => {
              tabRefs.current[index] = el
            }}
            className={cn(
              "z-10 h-7.5 cursor-pointer rounded-md border-0 bg-transparent px-3 py-2 transition-colors duration-300 outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none data-[state=active]:bg-transparent data-[state=active]:shadow-none",
              activeTab === tab.value
                ? "text-[#0e0e10] dark:text-white"
                : "text-[#0e0f1199] dark:text-[#ffffff99]"
            )}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span className="text-sm leading-5 font-medium whitespace-nowrap">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Content Area */}
      <div className="mt-8 w-full px-4">
        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="w-full animate-in duration-500 fade-in-50"
          >
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  )
}
