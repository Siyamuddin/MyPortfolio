"use client"

import { useMemo, useRef, useSyncExternalStore } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import {
  ContactShadows,
  Environment,
  Float,
  Sparkles,
} from "@react-three/drei"
import { Coins } from "lucide-react"
import type { Mesh, MeshStandardMaterial } from "three"
import { formatKRW, formatPercent } from "@/lib/finance/format"
import { cn } from "@/lib/cn"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"

export type CoinStack3DProps = {
  progress: number
  target?: number
  label?: string
  className?: string
}

const GOLD = "#ffdb70"
const FLOOR = "#121214"
const SPARKLE = "#d0d6e0"
const COIN_HEIGHT = 0.1
const COIN_GAP = 0.028
const COIN_RADIUS = 0.48

const clampProgress = (progress: number): number =>
  Math.max(0, Math.min(100, Number.isFinite(progress) ? progress : 0))

const progressToCoinCount = (progress: number, maxCoins: number): number => {
  const clamped = clampProgress(progress)
  return Math.max(
    1,
    Math.min(maxCoins, Math.round((clamped / 100) * (maxCoins - 1)) + 1)
  )
}

const supportsWebGL = (): boolean => {
  if (typeof document === "undefined") {
    return false
  }

  try {
    const canvas = document.createElement("canvas")
    const gl =
      canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl")
    return gl !== null
  } catch {
    return false
  }
}

type CoinProps = {
  index: number
  active: boolean
  y: number
}

const Coin = ({ index, active, y }: CoinProps) => {
  const meshRef = useRef<Mesh>(null)
  const materialRef = useRef<MeshStandardMaterial>(null)
  const rotY = useMemo(() => (index * 0.73) % (Math.PI * 0.35), [index])
  const rotZ = useMemo(() => Math.sin(index * 1.9) * 0.06, [index])

  useFrame((_, delta) => {
    const mesh = meshRef.current
    const material = materialRef.current
    if (!mesh || !material) {
      return
    }

    const speed = Math.min(1, delta * 6)
    const targetScale = active ? 1 : 0.15
    const targetOpacity = active ? 1 : 0
    const nextScale = mesh.scale.x + (targetScale - mesh.scale.x) * speed
    mesh.scale.setScalar(nextScale)
    material.opacity = material.opacity + (targetOpacity - material.opacity) * speed
    mesh.visible = material.opacity > 0.02
  })

  return (
    <mesh
      ref={meshRef}
      position={[0, y, 0]}
      rotation={[0, rotY, rotZ]}
      castShadow
      receiveShadow
      scale={0.15}
    >
      <cylinderGeometry args={[COIN_RADIUS, COIN_RADIUS, COIN_HEIGHT, 48]} />
      <meshStandardMaterial
        ref={materialRef}
        color={GOLD}
        metalness={0.9}
        roughness={0.25}
        transparent
        opacity={0}
      />
    </mesh>
  )
}

type StackSceneProps = {
  coinCount: number
  maxCoins: number
  animate: boolean
}

const StackScene = ({ coinCount, maxCoins, animate }: StackSceneProps) => {
  const stackHeight = (maxCoins - 1) * (COIN_HEIGHT + COIN_GAP)
  const baseY = -stackHeight / 2

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        castShadow
        intensity={1.15}
        position={[4, 6, 3]}
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <Environment preset="city" environmentIntensity={0.28} />
      {animate ? (
        <Sparkles
          count={40}
          scale={[6, 3, 6]}
          size={2}
          color={SPARKLE}
          opacity={0.25}
          speed={0.35}
        />
      ) : null}
      <Float
        speed={animate ? 1.5 : 0}
        rotationIntensity={animate ? 0.4 : 0}
        floatIntensity={animate ? 0.8 : 0}
      >
        <group position={[0, 0.15, 0]}>
          {Array.from({ length: maxCoins }, (_, index) => (
            <Coin
              key={index}
              index={index}
              active={index < coinCount}
              y={baseY + index * (COIN_HEIGHT + COIN_GAP)}
            />
          ))}
        </group>
      </Float>
      <ContactShadows
        position={[0, -1.15, 0]}
        opacity={0.35}
        blur={2.5}
        scale={8}
        far={4}
        color={FLOOR}
      />
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -1.16, 0]}
        receiveShadow
      >
        <circleGeometry args={[2.4, 64]} />
        <meshStandardMaterial color={FLOOR} roughness={0.9} metalness={0.05} />
      </mesh>
    </>
  )
}

const Fallback2D = ({
  progress,
  label,
}: {
  progress: number
  label: string
}) => {
  const clamped = clampProgress(progress)

  return (
    <div
      className="flex h-full min-h-[260px] flex-col items-center justify-center gap-3 px-4"
      role="img"
      aria-label={`${label}: ${formatPercent(clamped, 0)}`}
    >
      <div className="flex size-16 items-center justify-center rounded-full bg-gold/15 text-gold ring-1 ring-gold/30">
        <Coins className="size-8" aria-hidden="true" />
      </div>
      <p className="font-mono text-3xl font-semibold tracking-tight text-gold tabular-nums">
        {formatPercent(clamped, 0)}
      </p>
      <p className="text-xs text-light-gray-70">{label}</p>
    </div>
  )
}

const subscribeMobile = (onStoreChange: () => void) => {
  const mq = window.matchMedia("(max-width: 640px)")
  mq.addEventListener("change", onStoreChange)
  return () => {
    mq.removeEventListener("change", onStoreChange)
  }
}

const getMobileSnapshot = () => window.matchMedia("(max-width: 640px)").matches
const getServerMobileSnapshot = () => false

const emptySubscribe = () => () => {}

export const CoinStack3D = ({
  progress,
  target,
  label = "Emergency fund",
  className,
}: CoinStack3DProps) => {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false)
  const webglOk = useSyncExternalStore(
    emptySubscribe,
    supportsWebGL,
    () => false
  )
  const isMobile = useSyncExternalStore(
    subscribeMobile,
    getMobileSnapshot,
    getServerMobileSnapshot
  )
  const reducedMotion = usePrefersReducedMotion()
  const clamped = clampProgress(progress)
  const maxCoins = isMobile ? 8 : 12
  const coinCount = progressToCoinCount(clamped, maxCoins)

  const overlay = (
    <div className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex flex-col items-center gap-0.5 px-3 text-center">
      <p className="font-mono text-2xl font-semibold tracking-tight text-gold tabular-nums sm:text-3xl">
        {formatPercent(clamped, 0)}
      </p>
      <p className="text-[11px] text-light-gray-70 sm:text-xs">
        {label}
        {typeof target === "number" ? ` · target ${formatKRW(target)}` : ""}
      </p>
    </div>
  )

  if (!mounted) {
    return (
      <div
        className={cn(
          "relative h-[260px] w-full overflow-hidden rounded-xl sm:h-[280px]",
          className
        )}
        aria-hidden="true"
      />
    )
  }

  if (!webglOk || reducedMotion) {
    return (
      <div
        className={cn(
          "relative h-[260px] w-full overflow-hidden rounded-xl sm:h-[280px]",
          className
        )}
      >
        <Fallback2D progress={clamped} label={label} />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative h-[260px] w-full overflow-hidden rounded-xl sm:h-[280px]",
        className
      )}
      role="img"
      aria-label={`${label}: ${formatPercent(clamped, 0)}`}
    >
      <Canvas
        camera={{ position: [4, 3, 6], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        shadows
        frameloop="always"
        className="h-full w-full touch-none"
        aria-hidden="true"
      >
        <StackScene
          coinCount={coinCount}
          maxCoins={maxCoins}
          animate={!reducedMotion}
        />
      </Canvas>
      {overlay}
    </div>
  )
}
