export const projectPlaceholderSrc = () => {
  return "/images/project-placeholder.svg"
}

export const resolveProjectImageSrc = (image: string) =>
  /^https?:\/\//.test(image) || image.startsWith("/") ? image : projectPlaceholderSrc()
