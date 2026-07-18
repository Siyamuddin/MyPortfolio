"use client"

import { motion } from "motion/react"
import { cn } from "@/lib/cn"

type FadeInProps = {
  children: React.ReactNode
  className?: string
  delay?: number
}

export const FadeIn = ({ children, className, delay = 0 }: FadeInProps) => {
  return (
    <motion.div
      className={cn(className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}
