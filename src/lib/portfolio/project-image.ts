export const projectPlaceholderSrc = (title: string) =>
  `https://placehold.co/800x420/1a1a1e/ffdb70?text=${encodeURIComponent(title.slice(0, 18))}`

export const resolveProjectImageSrc = (image: string, title: string) =>
  image.startsWith("http") || image.startsWith("/")
    ? image
    : projectPlaceholderSrc(title)
