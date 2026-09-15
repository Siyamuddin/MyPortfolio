"use client";

import Image from "next/image";
import { useState } from "react";
import {
  IMAGE_FALLBACK,
  resolveProjectImageSrc,
} from "@/lib/portfolio/project-image";

export const ContentImage = ({
  src,
  alt,
  sizes,
  priority = false,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) => {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const resolved = resolveProjectImageSrc(src);
  const image = failedSource === src ? IMAGE_FALLBACK : resolved;
  return (
    <Image
      src={image}
      alt={image === IMAGE_FALLBACK ? `Preview unavailable for ${alt}` : alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setFailedSource(src)}
    />
  );
};
