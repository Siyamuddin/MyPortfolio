export const IMAGE_FALLBACK = "/images/preview-unavailable.svg"

export const resolveProjectImageSrc = (image: string) =>
  /^(https?:\/\/|\/(?!\/))/.test(image) ? image : IMAGE_FALLBACK
