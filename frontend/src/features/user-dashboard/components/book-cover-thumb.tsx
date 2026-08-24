import { useState } from "react"
import { BookOpenIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface BookCoverThumbProps {
  src?: string
  alt: string
  className?: string
  fallbackTitle?: string
}

export const BookCoverThumb = ({ src, alt, className, fallbackTitle }: BookCoverThumbProps) => {
  const [hasError, setHasError] = useState(false)

  if (!src || hasError) {
    return (
      <div
        className={cn(
          "flex aspect-2/3 w-12 shrink-0 flex-col items-center justify-center rounded-md border border-border/60 bg-muted/60 p-1 text-center shadow-xs transition-colors",
          className
        )}
        title={alt}
      >
        <BookOpenIcon className="size-4 text-muted-foreground/70" />
        {fallbackTitle && (
          <span className="mt-1 line-clamp-1 text-[9px] font-semibold text-muted-foreground">
            {fallbackTitle.slice(0, 3).toUpperCase()}
          </span>
        )}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={cn(
        "aspect-2/3 w-12 shrink-0 rounded-md border border-border/50 object-cover shadow-xs transition-transform hover:scale-105",
        className
      )}
      loading="lazy"
    />
  )
}
