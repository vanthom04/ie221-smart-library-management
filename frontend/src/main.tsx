import { BrowserRouter } from "react-router"
import { createRoot } from "react-dom/client"

import { App } from "@/App.tsx"
import { Toaster } from "@/components/ui/toast.tsx"
import { TooltipProvider } from "@/components/ui/tooltip"

import "./globals.css"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <TooltipProvider>
      <App />
      <Toaster />
    </TooltipProvider>
  </BrowserRouter>
)
