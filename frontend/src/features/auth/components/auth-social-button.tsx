import type { ComponentProps } from "react"

import { Button } from "@/components/ui/button"

interface AuthSocialButtonProps extends ComponentProps<typeof Button> {
  iconAlt: string
  iconSrc: string
}

export const AuthSocialButton = ({
  children,
  iconAlt,
  iconSrc,
  ...props
}: AuthSocialButtonProps) => {
  return (
    <Button variant="outline" className="h-10 bg-transparent hover:bg-background" {...props}>
      <img className="size-4" src={iconSrc} alt={iconAlt} />
      <span className="text-[13px]">{children}</span>
    </Button>
  )
}
