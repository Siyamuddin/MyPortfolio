/** CMS file ceiling. Vercel functions reject bodies above 4.5 MB, so this matches event photos. */
export const MAX_UPLOAD_BYTES = 4 * 1024 * 1024

export const uploadTooLargeError = `File too large (max ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB)`

const UPLOAD_FOLDERS = ["avatars", "projects", "blog", "skills", "resume"]
const UPLOAD_MIME_TYPES = [
  "image/jpeg", "image/png", "image/webp", "image/avif", "image/gif", "image/svg+xml", "application/pdf",
]

const text = (bytes: Uint8Array, start: number, end: number) => String.fromCharCode(...bytes.slice(start, end))

const matchesDeclaredType = (bytes: Uint8Array, mime: string) => {
  switch (mime) {
    case "image/jpeg": return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff
    case "image/png": return bytes[0] === 0x89 && text(bytes, 1, 4) === "PNG" && bytes[4] === 13 && bytes[5] === 10 && bytes[6] === 26 && bytes[7] === 10
    case "image/gif": return text(bytes, 0, 6) === "GIF87a" || text(bytes, 0, 6) === "GIF89a"
    case "image/webp": return text(bytes, 0, 4) === "RIFF" && text(bytes, 8, 12) === "WEBP"
    case "image/avif": return text(bytes, 4, 8) === "ftyp" && /avif|avis/.test(text(bytes, 8, 32))
    case "application/pdf": return text(bytes, 0, 5) === "%PDF-"
    case "image/svg+xml": {
      const start = bytes[0] === 0xef && bytes[1] === 0xbb && bytes[2] === 0xbf ? 3 : 0
      const prefix = text(bytes, start, bytes.length).trimStart().toLowerCase()
      return prefix.startsWith("<svg") || (prefix.startsWith("<?xml") && prefix.includes("<svg"))
    }
    default: return false
  }
}

const extensionFor = (mime: string) =>
  mime === "image/jpeg" ? "jpg"
  : mime === "image/svg+xml" ? "svg"
  : mime === "application/pdf" ? "pdf"
  : mime.slice(mime.indexOf("/") + 1)

export const preparePortfolioUpload = async (
  file: File,
  folder: string,
  options?: { types?: readonly string[]; folders?: readonly string[] },
): Promise<
  | { ok: true; folder: string; extension: string; contentType: string }
  | { ok: false; error: string; reason: "folder" | "type" | "bytes" }
> => {
  const folders = options?.folders ?? UPLOAD_FOLDERS
  const types = options?.types ?? UPLOAD_MIME_TYPES
  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "")
  if (!folders.includes(safeFolder)) {
    return { ok: false, error: `Invalid folder. Allowed: ${folders.join(", ")}`, reason: "folder" }
  }
  const declared = file.type.split(";")[0]?.trim().toLowerCase() ?? ""
  if (!types.includes(declared)) return { ok: false, error: "Unsupported file type.", reason: "type" }
  const signature = new Uint8Array(await file.slice(0, 512).arrayBuffer())
  if (!matchesDeclaredType(signature, declared)) {
    return { ok: false, error: "This file does not match its declared type.", reason: "bytes" }
  }
  return { ok: true, folder: safeFolder, extension: extensionFor(declared), contentType: declared }
}
