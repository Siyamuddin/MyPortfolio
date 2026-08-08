import type { ButtonHTMLAttributes, ReactNode } from "react"
import { cn } from "@/lib/cn"

type ButtonVariant = "default" | "outline" | "ghost"
type ButtonSize = "default" | "sm" | "icon"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
  children?: ReactNode
}

const variantClass: Record<ButtonVariant, string> = {
  default:
    "border-transparent bg-gold text-eerie-black-1 hover:bg-gold-dark",
  outline:
    "border-jet bg-transparent text-light-gray hover:border-gold hover:text-gold",
  ghost: "border-transparent bg-transparent text-light-gray hover:text-gold",
}

const sizeClass: Record<ButtonSize, string> = {
  default: "h-9 gap-1.5 px-3",
  sm: "h-8 gap-1 px-2.5 text-[0.8rem]",
  icon: "size-9",
}

export const Button = ({
  className,
  variant = "default",
  size = "default",
  type = "button",
  children,
  ...props
}: ButtonProps) => (
  <button
    type={type}
    className={cn(
      "inline-flex shrink-0 items-center justify-center rounded-lg border text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold",
      variantClass[variant],
      sizeClass[size],
      className
    )}
    {...props}
  >
    {children}
  </button>
)
