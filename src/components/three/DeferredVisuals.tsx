"use client"

import dynamic from "next/dynamic"
import { useEnhancedVisuals } from "@/hooks/useEnhancedVisuals"

const Network = dynamic(() => import("./AgenticNetworkBackground").then((module) => module.AgenticNetworkBackground), { ssr: false })

export const DeferredNetwork = (props: { className?: string; pointer: React.RefObject<{ x: number; y: number }> }) => {
  const enabled = useEnhancedVisuals()
  return enabled ? <Network {...props} /> : <div className={`hero-glow-fallback pointer-events-none absolute inset-0 ${props.className ?? ""}`} aria-hidden="true" />
}
