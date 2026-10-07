"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Line } from "@react-three/drei"
import * as THREE from "three"
import { cn } from "@/lib/cn"

const GOLD = "#ffdb70"
const NODE_COUNT = 22
const LINK_DISTANCE = 2.35

type PointerRef = React.RefObject<{ x: number; y: number }>
type RunningRef = React.RefObject<boolean>

type NetworkProps = {
  pointer: PointerRef
  running: RunningRef
}

const Network = ({ pointer, running }: NetworkProps) => {
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
    // Pause the render loop when the hero is offscreen or the tab is hidden.
    if (running.current === false) return
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
  const containerRef = useRef<HTMLDivElement>(null)
  const intersectingRef = useRef(true)
  const runningRef = useRef(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Fade in on mount (the chunk is deferred, so this avoids a hard pop).
    setVisible(true)

    const element = containerRef.current
    const update = () => {
      runningRef.current = intersectingRef.current && !document.hidden
    }

    const observer =
      element && "IntersectionObserver" in window
        ? new IntersectionObserver(
            ([entry]) => {
              intersectingRef.current = entry.isIntersecting
              update()
            },
            { threshold: 0.01 }
          )
        : null

    if (element && observer) observer.observe(element)
    document.addEventListener("visibilitychange", update)

    return () => {
      observer?.disconnect()
      document.removeEventListener("visibilitychange", update)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden="true"
    >
      <div
        className="h-full w-full transition-opacity duration-[600ms] ease-[cubic-bezier(.22,1,.36,1)]"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <Canvas
          camera={{ position: [0, 0, 6.5], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
          className="h-full w-full"
        >
          <ambientLight intensity={0.35} />
          <pointLight position={[4, 4, 4]} intensity={0.6} color={GOLD} />
          <Network pointer={pointer} running={runningRef} />
        </Canvas>
      </div>
    </div>
  )
}
