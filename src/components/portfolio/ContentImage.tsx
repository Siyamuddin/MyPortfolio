"use client"

import Image, { type ImageProps } from "next/image"
import { useState } from "react"

export const ContentImage = (props: ImageProps) => {
  const [failedSource, setFailedSource] = useState<ImageProps["src"] | null>(null)
  return <Image {...props} src={failedSource === props.src ? "/images/project-placeholder.svg" : props.src}
    alt={props.alt} onError={() => setFailedSource(props.src)} />
}
