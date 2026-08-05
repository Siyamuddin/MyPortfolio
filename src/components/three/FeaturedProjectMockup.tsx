"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import * as THREE from "three"
import { cn } from "@/lib/cn"
import { projectPlaceholderSrc } from "@/lib/portfolio/project-image"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"

const GOLD = "#ffdb70"

type Tilt = { x: number; y: number }

type LaptopModelProps = {
  imageSrc: string
  tilt: Tilt
}

const LaptopModel = ({ imageSrc, tilt }: LaptopModelProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const texture = useLoader(THREE.TextureLoader, imageSrc)
  texture.colorSpace = THREE.SRGBColorSpace

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.04
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      tilt.y * 0.35 - 0.12,
      0.08
    )
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      tilt.x * 0.45 + 0.28,
      0.08
    )
  })

  return (
    <group ref={groupRef}>
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[2.85, 0.11, 1.95]} />
        <meshStandardMaterial color="#2b2b30" metalness={0.45} roughness={0.55} />
      </mesh>
      <mesh position={[0, -0.47, 0.02]}>
        <boxGeometry args={[2.5, 0.02, 1.55]} />
        <meshStandardMaterial color="#38383d" metalness={0.2} roughness={0.8} />
      </mesh>
      <group position={[0, 0.05, -0.82]} rotation={[-0.42, 0, 0]}>
        <mesh>
          <boxGeometry args={[2.65, 1.68, 0.07]} />
          <meshStandardMaterial color="#222226" metalness={0.35} roughness={0.65} />
        </mesh>
        <mesh position={[0, 0, 0.038]}>
          <planeGeometry args={[2.38, 1.42]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

type FeaturedProjectVisualProps = {
  imageSrc: string
  title: string
  className?: string
}

const FlatProjectImage = ({ imageSrc, title }: FeaturedProjectVisualProps) => (
  <Image
    src={imageSrc}
    alt={title}
    fill
    sizes="(min-width:768px) 50vw, 100vw"
    className="object-cover"
    unoptimized={imageSrc.includes("placehold.co")}
  />
)

/**
 * Texture loading throws inside the canvas, so sources are verified up front and
 * a placeholder is substituted when the project image is missing.
 */
const useLoadableImage = (imageSrc: string, fallbackSrc: string) => {
  const [state, setState] = useState<{
    src: string
    status: "loading" | "ready" | "failed"
  }>({ src: imageSrc, status: "loading" })

  useEffect(() => {
    let cancelled = false
    setState({ src: imageSrc, status: "loading" })

    const probe = (src: string, isFallback: boolean) => {
      const image = new window.Image()
      image.crossOrigin = "anonymous"
      image.onload = () => {
        if (!cancelled) setState({ src, status: "ready" })
      }
      image.onerror = () => {
        if (cancelled) return
        if (isFallback) {
          setState({ src, status: "failed" })
          return
        }
        probe(fallbackSrc, true)
      }
      image.src = src
    }

    probe(imageSrc, imageSrc === fallbackSrc)

    return () => {
      cancelled = true
    }
  }, [imageSrc, fallbackSrc])

  return state
}

const useIsWideViewport = () => {
  const [isWide, setIsWide] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)")
    const handleChange = () => setIsWide(media.matches)
    handleChange()
    media.addEventListener("change", handleChange)
    return () => media.removeEventListener("change", handleChange)
  }, [])

  return isWide
}

export const FeaturedProjectVisual = ({
  imageSrc,
  title,
  className,
}: FeaturedProjectVisualProps) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const isWide = useIsWideViewport()
  const fallbackSrc = projectPlaceholderSrc(title)
  const { src: resolvedSrc, status } = useLoadableImage(imageSrc, fallbackSrc)
  const containerRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState<Tilt>({ x: 0, y: 0 })

  const canRenderMockup = isWide && !prefersReducedMotion && status === "ready"

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!containerRef.current || !canRenderMockup) return
    const rect = containerRef.current.getBoundingClientRect()
    setTilt({
      x: (event.clientX - rect.left) / rect.width - 0.5,
      y: (event.clientY - rect.top) / rect.height - 0.5,
    })
  }

  const handlePointerLeave = () => {
    setTilt({ x: 0, y: 0 })
  }

  if (!canRenderMockup) {
    return (
      <div className={cn("relative h-full w-full", className)}>
        <FlatProjectImage imageSrc={resolvedSrc} title={title} />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full w-full bg-gradient-to-br from-eerie-black-1 via-smoky-black to-eerie-black-2",
        className
      )}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0.15, 4.2], fov: 38 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        className="h-full w-full"
      >
        <ambientLight intensity={0.55} />
        <pointLight position={[3, 3, 4]} intensity={0.85} color={GOLD} />
        <pointLight position={[-3, -1, 2]} intensity={0.35} color="#ffffff" />
        <LaptopModel imageSrc={resolvedSrc} tilt={tilt} />
      </Canvas>
    </div>
  )
}
