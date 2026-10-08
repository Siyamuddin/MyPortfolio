/** CMS file ceiling shared by admin server actions and the agent upload route. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024

export const uploadTooLargeError = `File too large (max ${MAX_UPLOAD_BYTES / (1024 * 1024)}MB)`
