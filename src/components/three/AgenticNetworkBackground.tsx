"use client"

import { useMemo, useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Line } from "@react-three/drei"
import * as THREE from "three"
import { cn } from "@/lib/cn"
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion"

const GOLD = "#ffdb70"
const NODE_COUNT = 22
const LINK_DISTANCE = 2.35

type PointerRef = React.RefObject<{ x: number; y: number }>

type NetworkProps = {
  pointer: PointerRef
}

const Network = ({ pointer }: NetworkProps) => {
  const groupRef = useRef<THREE.Group>(null)
  const pulseRef = useRef(0)

  const { nodes, links } = useMemo(() => {
    const nodeList: THREE.Vector3[] = []
    for (let index = 0; index < NODE_COUNT; index += 1) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const radius = 2.2 + Math.random() * 1.4
      nodeList.push(
        new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta) * 0.65,
          radius * Math.cos(phi)
        )
      )
    }

    const linkList: Array<[THREE.Vector3, THREE.Vector3, number]> = []
    for (let index = 0; index < nodeList.length; index += 1) {
      for (let other = index + 1; other < nodeList.length; other += 1) {
        const distance = nodeList[index].distanceTo(nodeList[other])
        if (distance < LINK_DISTANCE) {
          linkList.push([nodeList[index], nodeList[other], distance])
        }
      }
    }

    return { nodes: nodeList, links: linkList }
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const aim = pointer.current ?? { x: 0, y: 0 }
    pulseRef.current = state.clock.elapsedTime
    groupRef.current.rotation.y += delta * 0.12
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      aim.y * 0.18,
      0.05
    )
    groupRef.current.rotation.z = THREE.MathUtils.lerp(
      groupRef.current.rotation.z,
      aim.x * 0.08,
      0.05
    )
  })

  return (
    <group ref={groupRef}>
      {nodes.map((position, index) => (
        <mesh key={`node-${index}`} position={position}>
          <sphereGeometry args={[0.055, 10, 10]} />
          <meshBasicMaterial color={GOLD} transparent opacity={0.9} />
        </mesh>
      ))}
      {links.map(([start, end, distance], index) => {
        const strength = 1 - distance / LINK_DISTANCE
        const pulse =
          0.12 +
          strength * 0.18 +
          Math.sin(pulseRef.current * 1.4 + index * 0.35) * 0.04
        return (
          <Line
            key={`link-${index}`}
            points={[start, end]}
            color={GOLD}
            transparent
            opacity={pulse}
            lineWidth={1}
          />
        )
      })}
    </group>
  )
}

type AgenticNetworkBackgroundProps = {
  className?: string
  pointer: PointerRef
}

export const AgenticNetworkBackground = ({
  className,
  pointer,
}: AgenticNetworkBackgroundProps) => {
  const prefersReducedMotion = usePrefersReducedMotion()

  if (prefersReducedMotion) {
    return (
      <div
        className={cn("hero-glow-fallback pointer-events-none", className)}
        aria-hidden="true"
      />
    )
  }

  return (
    <div className={cn("pointer-events-none absolute inset-0", className)} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
        className="h-full w-full"
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[4, 4, 4]} intensity={0.6} color={GOLD} />
        <Network pointer={pointer} />
      </Canvas>
    </div>
  )
}
