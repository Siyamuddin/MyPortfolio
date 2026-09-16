"use client"

import dynamic from "next/dynamic"
import { ContentImage as Image } from "@/components/portfolio/ContentImage"
import { useEnhancedVisuals } from "@/hooks/useEnhancedVisuals"

const Network = dynamic(() => import("./AgenticNetworkBackground").then((module) => module.AgenticNetworkBackground), { ssr: false })
const Mockup = dynamic(() => import("./FeaturedProjectMockup").then((module) => module.FeaturedProjectVisual), { ssr: false })

export const DeferredNetwork = (props: { className?: string; pointer: React.RefObject<{ x: number; y: number }> }) => {
  const enabled = useEnhancedVisuals()
  return enabled ? <Network {...props} /> : <div className={`hero-glow-fallback pointer-events-none absolute inset-0 ${props.className ?? ""}`} aria-hidden="true" />
}

export const DeferredProjectVisual = (props: { imageSrc: string; title: string; className?: string }) => {
  const enabled = useEnhancedVisuals()
  return <div className={`relative h-full w-full ${props.className ?? ""}`}>
    <Image src={props.imageSrc} alt={props.title} fill sizes="(min-width: 1250px) 400px, (min-width: 768px) 45vw, 100vw" className="object-cover" />
    {enabled ? <div className="absolute inset-0"><Mockup {...props} /></div> : null}
  </div>
}
