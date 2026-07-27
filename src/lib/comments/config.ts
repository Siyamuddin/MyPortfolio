export type CommentProviderMode = "native" | "giscus" | "both"

export const getCommentProviderMode = (): CommentProviderMode => {
  const value = (process.env.NEXT_PUBLIC_COMMENT_PROVIDER ?? "both").toLowerCase()
  if (value === "native" || value === "giscus" || value === "both") return value
  return "both"
}

export const showNativeComments = () => {
  const mode = getCommentProviderMode()
  return mode === "native" || mode === "both"
}

export const showGiscusComments = () => {
  const mode = getCommentProviderMode()
  return mode === "giscus" || mode === "both"
}

export const getGiscusConfig = () => {
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO ?? ""
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? ""
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? ""
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? ""

  if (!repo || !repoId || !category || !categoryId) return null

  return { repo, repoId, category, categoryId }
}
