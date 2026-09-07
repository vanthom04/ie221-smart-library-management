import { createRoot } from "react-dom/client"
import { RouterProvider } from "react-router/dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { LazyMotion, domAnimation } from "motion/react"

import { router } from "@/router/routes"
import { queryClient } from "@/lib/query-client"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AnimatedToastProvider } from "@/components/ui/animated-toast"

import "@/globals.css"

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <LazyMotion features={domAnimation}>
      <AnimatedToastProvider>
        <TooltipProvider>
          <RouterProvider router={router} />
        </TooltipProvider>
      </AnimatedToastProvider>
    </LazyMotion>
  </QueryClientProvider>
)
