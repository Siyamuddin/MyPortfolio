"use client"

import Giscus from "@giscus/react"
import { getGiscusConfig } from "@/lib/comments/config"

type GiscusCommentsProps = {
  slug: string
}

export const GiscusComments = ({ slug }: GiscusCommentsProps) => {
  const config = getGiscusConfig()
  if (!config) return null

  return (
    <section className="mt-10 border-t border-jet pt-8" aria-label="GitHub discussions">
      <h2 className="mb-4 text-xl text-white-2">Discussion</h2>
      <Giscus
        id={`giscus-${slug}`}
        repo={config.repo as `${string}/${string}`}
        repoId={config.repoId}
        category={config.category}
        categoryId={config.categoryId}
        mapping="pathname"
        strict="0"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="transparent_dark"
        lang="en"
        loading="lazy"
      />
    </section>
  )
}
