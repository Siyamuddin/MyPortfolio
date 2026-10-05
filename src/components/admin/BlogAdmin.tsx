"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, type FocusEvent, type FormEvent } from "react"
import {
  CalendarDays, Check, ExternalLink, FileText, ImagePlus, LoaderCircle,
  Pencil, Plus, Trash2, X,
} from "lucide-react"
import { TagsInput } from "@/components/admin/TagsInput"
import { DeleteConfirmDialog, StudioEmpty, StudioFilter, StudioNotice } from "@/components/admin/studio/StudioChrome"
import { useModalDialog } from "@/components/admin/studio/useModalDialog"
import { deleteItemAction, uploadFileAction, upsertBlogAction } from "@/lib/portfolio/admin-actions"
import { getBlogPostHref, slugifyTitle } from "@/lib/portfolio/blog"
import { mapBlogPost } from "@/lib/portfolio/mappers"
import { labelFromSlug, type Tag } from "@/lib/portfolio/tags"
import type { BlogPostRow } from "@/lib/portfolio/types"
import styles from "./studio/AdminStudio.module.css"

type PostFilter = "all" | "published" | "draft"

const BLOG_UPLOAD_ACCEPT = "image/*,.pdf,.webp,.svg"
const ADD_BUTTON_ID = "blog-add-button"

const defaultPostDates = () => {
  const now = new Date()
  const dateTime = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`
  const date = new Intl.DateTimeFormat("en", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(now)
  return { date, dateTime }
}

const previewHref = (post: BlogPostRow) => getBlogPostHref(mapBlogPost(post))

const canPreviewImage = (value: string) =>
  value.startsWith("/") || value.startsWith("https://") || value.startsWith("http://")

export function BlogAdmin({
  items,
  tagLabels = {},
}: {
  items: BlogPostRow[]
  tagLabels?: Record<string, string>
}) {
  const router = useRouter()
  const [filter, setFilter] = useState<PostFilter>("all")
  const [editing, setEditing] = useState<BlogPostRow | "new" | null>(null)
  const [deleting, setDeleting] = useState<BlogPostRow | null>(null)
  const [removedIds, setRemovedIds] = useState<string[]>([])
  const [notice, setNotice] = useState("")
  const posts = items.filter((item) => !removedIds.includes(item.id))
  const visiblePosts = posts.filter((item) => filter === "all" || item.status === filter)
  const counts = {
    all: posts.length,
    published: posts.filter((post) => post.status === "published").length,
    draft: posts.filter((post) => post.status === "draft").length,
  }

  const startNewPost = () => {
    setNotice("")
    setEditing("new")
  }

  return (
    <div className={styles.root}>
      <div className={styles.heading}>
        <div>
          <p className={styles.eyebrow}>Your writing</p>
          <h2>Blog</h2>
          <p className={styles.intro}>Drafts, published essays, and the pieces you’re still shaping.</p>
        </div>
        <div className={styles.headerActions}>
          <Link href="/blog" className={styles.secondaryButton}>
            View blog <ExternalLink size={15} aria-hidden="true" />
          </Link>
          <button id={ADD_BUTTON_ID} type="button" className={styles.primaryButton} onClick={startNewPost}>
            <Plus size={18} aria-hidden="true" /> Add post
          </button>
        </div>
      </div>

      {notice ? <StudioNotice>{notice}</StudioNotice> : null}

      <StudioFilter
        label="Filter posts by visibility"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All posts", count: counts.all },
          { value: "published", label: "Published", count: counts.published },
          { value: "draft", label: "Drafts", count: counts.draft },
        ]}
        summary={`${counts.published} on your site`}
      />

      {visiblePosts.length ? (
        <div className={styles.itemList}>
          {visiblePosts.map((post) => {
            const href = previewHref(post)
            return (
              <article key={post.id} className={styles.itemCard}>
                <div className={styles.itemCover}>
                  {canPreviewImage(post.image) ? (
                    <CoverImage src={post.image} alt="" />
                  ) : (
                    <FileText size={30} strokeWidth={1.3} aria-hidden="true" />
                  )}
                </div>
                <div className={styles.itemInfo}>
                  <div className={styles.itemTags}>
                    {post.category ? <span className={styles.category}>{post.category}</span> : null}
                    <span className={styles.status} data-published={post.status === "published"}>
                      {post.status === "published" ? "Published" : "Draft"}
                    </span>
                  </div>
                  <h3>{post.title}</h3>
                  <div className={styles.itemMeta}>
                    <span>
                      <CalendarDays size={14} aria-hidden="true" />
                      <time dateTime={post.date_time || undefined}>{post.date || "No date"}</time>
                    </span>
                    {post.slug ? <span>/{post.slug}</span> : null}
                  </div>
                </div>
                <div className={styles.rowActions}>
                  {href ? (
                    <Link
                      href={href}
                      className={styles.iconButton}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Preview ${post.title}`}
                    >
                      <ExternalLink size={16} aria-hidden="true" />
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    aria-label={`Edit ${post.title}`}
                    onClick={() => {
                      setNotice("")
                      setEditing(post)
                    }}
                  >
                    <Pencil size={15} aria-hidden="true" /> Edit
                  </button>
                  <button
                    type="button"
                    className={styles.iconButton}
                    aria-label={`Delete ${post.title}`}
                    onClick={() => setDeleting(post)}
                  >
                    <Trash2 size={17} aria-hidden="true" />
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <StudioEmpty
          icon={<FileText size={32} strokeWidth={1.3} aria-hidden="true" />}
          title={filter === "all" ? "Your blog starts with one post." : `No ${filter === "draft" ? "drafts" : "published posts"} yet.`}
          description={
            filter === "all"
              ? "Write a draft, add a cover, and publish it when it’s ready for your site."
              : "Choose All posts to see your collection, or start a new draft."
          }
          actionLabel={filter === "all" ? "Write your first post" : "Add post"}
          onAction={startNewPost}
        />
      )}

      {editing ? (
        <PostEditor
          key={editing === "new" ? "new" : editing.id}
          post={editing === "new" ? undefined : editing}
          tagLabels={tagLabels}
          sortOrder={editing === "new" ? items.length : editing.sort_order}
          onClose={() => setEditing(null)}
          onSaved={(status) => {
            setNotice(status === "published" ? "Post saved and published to your blog." : "Draft saved. Publish it when you’re ready.")
            setEditing(null)
            router.refresh()
          }}
        />
      ) : null}
      {deleting ? (
        <DeleteConfirmDialog
          titleId="delete-post-title"
          descriptionId="delete-post-description"
          title="Delete this post?"
          description={`“${deleting.title}” will be removed from your blog. This cannot be undone.`}
          cancelLabel="Keep post"
          confirmLabel="Delete post"
          restoreFocusId={ADD_BUTTON_ID}
          fallbackError="Couldn’t delete this post. Please try again."
          networkError="Couldn’t delete this post. Check your connection and try again."
          onClose={() => setDeleting(null)}
          onDeleted={() => {
            setRemovedIds((ids) => [...ids, deleting.id])
            setNotice("Post deleted.")
            setDeleting(null)
            router.refresh()
          }}
          onConfirm={() => deleteItemAction("blog_posts", deleting.id)}
        />
      ) : null}
    </div>
  )
}

const CoverImage = ({ src, alt }: { src: string; alt: string }) => {
  const [failed, setFailed] = useState(false)
  if (failed) return <FileText size={30} strokeWidth={1.3} aria-hidden="true" />
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={styles.coverFill} onError={() => setFailed(true)} />
  )
}

function PostEditor({
  post,
  tagLabels,
  sortOrder,
  onClose,
  onSaved,
}: {
  post?: BlogPostRow
  tagLabels: Record<string, string>
  sortOrder: number
  onClose: () => void
  onSaved: (status: "draft" | "published") => void
}) {
  const dialogRef = useModalDialog(ADD_BUTTON_ID)
  const formRef = useRef<HTMLFormElement>(null)
  const uploadRef = useRef<HTMLInputElement>(null)
  const busyRef = useRef(false)
  const freshDates = post ? null : defaultPostDates()
  const defaultTags: Tag[] = (post?.tags ?? []).map((slug) => ({
    slug,
    label: tagLabels[slug] ?? labelFromSlug(slug),
  }))
  const [slug, setSlug] = useState(post?.slug ?? "")
  const [slugEdited, setSlugEdited] = useState(Boolean(post?.slug))
  const [image, setImage] = useState(post?.image ?? "")
  const [status, setStatus] = useState<"draft" | "published">(post?.status ?? "draft")
  const [dirty, setDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState("")
  const [uploadError, setUploadError] = useState("")
  const [error, setError] = useState("")
  const busy = saving || uploading
  const liveHref = post ? previewHref(post) : null

  const closeEditor = () => {
    if (busyRef.current) return
    if (dirty && !window.confirm("Discard your unsaved post changes?")) return
    onClose()
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "s") return
      event.preventDefault()
      if (busyRef.current) return
      formRef.current?.requestSubmit()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const markDirty = () => setDirty(true)

  const handleTitleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (slugEdited) return
    const next = slugifyTitle(event.currentTarget.value)
    if (next) setSlug(next)
  }

  const savePost = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault()
    if (busyRef.current) return
    const data = new FormData(formEvent.currentTarget)
    const nextSlug = slug.trim() || slugifyTitle(String(data.get("title") ?? ""))
    if (!nextSlug) {
      setError("Add a slug, or a title that can become one.")
      return
    }
    if (nextSlug !== slug) setSlug(nextSlug)
    data.set("slug", nextSlug)
    data.set("status", status)
    data.set("image", image)
    busyRef.current = true
    setSaving(true)
    setError("")
    try {
      const result = await upsertBlogAction(data)
      if (!result.ok) {
        setError(result.error ?? "The post couldn’t be saved. Please try again.")
        return
      }
      onSaved(status)
    } catch {
      setError("The post couldn’t be saved. Check your connection and try again.")
    } finally {
      busyRef.current = false
      setSaving(false)
    }
  }

  const uploadCover = async (file: File | undefined) => {
    if (!file || busyRef.current) return
    if (uploadRef.current) uploadRef.current.value = ""
    busyRef.current = true
    setUploading(true)
    setUploadError("")
    setUploadProgress("Uploading cover…")
    try {
      const body = new FormData()
      body.set("file", file)
      body.set("folder", "blog")
      const result = await uploadFileAction(body)
      if (result.ok && result.url) {
        setImage(result.url)
        setDirty(true)
        setUploadProgress("Cover added.")
      } else {
        setUploadProgress("")
        setUploadError(result.error ?? "Upload failed. Please try again.")
      }
    } catch {
      setUploadProgress("")
      setUploadError("Upload failed. Check your connection and try again.")
    } finally {
      setUploading(false)
      busyRef.current = false
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className={`${styles.dialog} ${styles.editor}`}
      aria-labelledby="blog-editor-title"
      onCancel={(event) => {
        event.preventDefault()
        closeEditor()
      }}
    >
      <form ref={formRef} onSubmit={savePost} onChange={markDirty} className={styles.editorForm}>
        {post ? <input type="hidden" name="id" value={post.id} /> : null}
        <input type="hidden" name="image" value={image} />
        <header className={styles.dialogHeader}>
          <div>
            <p className={styles.eyebrow}>{post ? "Your post" : "A new piece"}</p>
            <h2 id="blog-editor-title">{post ? "Edit post" : "Add post"}</h2>
          </div>
          <button type="button" className={styles.iconButton} onClick={closeEditor} disabled={busy} aria-label="Close post editor">
            <X size={21} aria-hidden="true" />
          </button>
        </header>
        <div className={styles.editorBody}>
          <fieldset className={styles.formSection} disabled={saving}>
            <legend>The essentials</legend>
            <p className={styles.sectionDescription}>Give this piece a title and a place on your blog.</p>
            <label className={styles.field}>
              Title <span aria-hidden="true">*</span>
              <input
                name="title"
                required
                defaultValue={post?.title}
                placeholder="e.g. Agentic AI in Industrial IoT Security"
                autoFocus
                onBlur={handleTitleBlur}
              />
            </label>
            <div className={styles.fieldGrid}>
              <label className={styles.field}>
                Slug <span aria-hidden="true">*</span>
                <input
                  name="slug"
                  value={slug}
                  onChange={(event) => {
                    setSlug(event.target.value)
                    setSlugEdited(event.target.value.trim().length > 0)
                  }}
                  placeholder="agentic-ai-in-industrial-iot"
                  aria-describedby="blog-slug-hint"
                />
                <small id="blog-slug-hint">Public URL: /blog/{slug || "your-slug"}. Filled in from the title until you edit it.</small>
              </label>
              <label className={styles.field}>
                Category
                <input name="category" defaultValue={post?.category ?? ""} placeholder="e.g. Research" />
              </label>
            </div>
          </fieldset>

          <fieldset className={styles.formSection} disabled={saving}>
            <legend>When it appears</legend>
            <p className={styles.sectionDescription}>Readers see the date label. The public blog orders posts by that date.</p>
            <div className={styles.fieldGrid}>
              <label className={styles.field}>
                Date label
                <input name="date" defaultValue={post?.date ?? freshDates?.date ?? ""} placeholder="Mar 2026" />
              </label>
              <label className={styles.field}>
                Date time
                <input name="date_time" defaultValue={post?.date_time ?? freshDates?.dateTime ?? ""} placeholder="2026-03" aria-describedby="blog-date-hint" />
                <small id="blog-date-hint">Machine-readable date, usually YYYY-MM.</small>
              </label>
            </div>
            <label className={styles.field}>
              Sort order
              <input name="sort_order" type="number" required defaultValue={post?.sort_order ?? sortOrder} aria-describedby="blog-sort-hint" />
              <small id="blog-sort-hint">Lower numbers appear first in this admin list.</small>
            </label>
          </fieldset>

          <fieldset className={styles.formSection} disabled={saving}>
            <legend>The story</legend>
            <label className={styles.field}>
              Excerpt
              <textarea name="excerpt" rows={3} defaultValue={post?.excerpt ?? ""} placeholder="A short summary for cards and search results." />
            </label>
            <label className={`${styles.field} ${styles.bodyField}`}>
              Body (MDX)
              <textarea name="body" rows={16} defaultValue={post?.body ?? ""} placeholder="Write the post in Markdown or MDX." aria-describedby="blog-body-hint" />
              <small id="blog-body-hint">MDX. Callout, YouTube, and CodeBlock are available.</small>
            </label>
          </fieldset>

          <fieldset className={styles.formSection} disabled={busy}>
            <legend>Cover</legend>
            <p className={styles.sectionDescription}>This image leads the post. Leave it blank to publish without one.</p>
            <input
              ref={uploadRef}
              id="blog-cover-upload"
              className={styles.hiddenInput}
              type="file"
              accept={BLOG_UPLOAD_ACCEPT}
              disabled={busy}
              onChange={(event) => {
                void uploadCover(event.target.files?.[0])
              }}
            />
            <button className={styles.uploadButton} type="button" disabled={busy} onClick={() => uploadRef.current?.click()}>
              <ImagePlus size={25} strokeWidth={1.5} aria-hidden="true" />
              <span>
                {image ? "Replace cover" : "Add a cover"}
                <small>Upload an image, or paste a URL below</small>
              </span>
              <Plus size={19} aria-hidden="true" />
            </button>
            <div className={styles.uploadFeedback}>
              {uploadProgress ? (
                <p className={styles.uploadStatus} role="status">
                  {uploading ? <LoaderCircle size={16} className={styles.spinner} aria-hidden="true" /> : null}
                  {uploadProgress}
                </p>
              ) : null}
              {uploadError ? (
                <p className={styles.error} role="alert">{uploadError}</p>
              ) : null}
            </div>
            <div className={canPreviewImage(image) ? styles.photoEditor : styles.photoFields}>
              {canPreviewImage(image) ? (
                <div key="cover-preview" className={styles.photoPreview}>
                  <CoverImage src={image} alt="Cover preview" />
                  <span className={styles.coverLabel}>Cover</span>
                </div>
              ) : null}
              <div key="cover-fields" className={styles.photoFields}>
                <label className={styles.field}>
                  Image URL
                  <input
                    value={image}
                    onChange={(event) => {
                      setImage(event.target.value)
                      markDirty()
                    }}
                    placeholder="https://"
                    aria-label="Cover image URL"
                  />
                </label>
                {image ? (
                  <div className={styles.photoActions}>
                    <button
                      type="button"
                      className={styles.textButton}
                      onClick={() => {
                        setImage("")
                        setUploadProgress("")
                        markDirty()
                      }}
                    >
                      Remove cover
                    </button>
                    {canPreviewImage(image) ? (
                      <span className={styles.coverHint}>
                        <Check size={13} aria-hidden="true" /> Blog cover
                      </span>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </fieldset>

          <fieldset className={styles.formSection} disabled={saving}>
            <legend>Tags &amp; social preview</legend>
            <p className={styles.sectionDescription}>
              Tags create crawlable topic pages at <code>/tags</code>. The social image is optional.
            </p>
            <TagsInput defaultTags={defaultTags} onChange={markDirty} />
            <label className={styles.field}>
              Social image URL
              <input name="og_image" defaultValue={post?.og_image ?? ""} placeholder="Optional link-preview image" />
              <small>Used when this post is shared. The cover is separate.</small>
            </label>
            <label className={styles.field}>
              External URL
              <input name="url" defaultValue={post?.url ?? ""} placeholder="https://" />
              <small>Optional. Used when the post is not a published article on this site.</small>
            </label>
          </fieldset>

          <fieldset className={styles.visibilitySection} disabled={saving}>
            <legend>Visibility</legend>
            <div className={styles.visibilityRow}>
              <p>{status === "published" ? "This post will appear on your public blog." : "Only you can see this post until you publish it."}</p>
              <label className={styles.field}>
                <span className={styles.visuallyHidden}>Post visibility</span>
                <select value={status} onChange={(event) => setStatus(event.target.value as "draft" | "published")}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </label>
            </div>
          </fieldset>
        </div>
        <footer className={styles.dialogFooter}>
          {error ? <p className={styles.error} role="alert">{error}</p> : null}
          <div className={styles.footerRow}>
            <p>
              {uploading
                ? "Finish uploading before saving."
                : status === "published"
                  ? "Ready for your blog."
                  : "Save now. Share when you’re ready."}
              <span className={styles.visuallyHidden}> Press Command+S or Control+S to save.</span>
            </p>
            <div className={styles.footerButtons}>
              {liveHref ? (
                <Link href={liveHref} className={styles.secondaryButton} target="_blank" rel="noopener noreferrer">
                  Preview <ExternalLink size={15} aria-hidden="true" />
                </Link>
              ) : null}
              <button type="button" className={styles.secondaryButton} disabled={busy} onClick={closeEditor}>
                Cancel
              </button>
              <button type="submit" className={styles.primaryButton} disabled={busy} title="Save (⌘S)">
                {saving ? (
                  <>
                    <LoaderCircle size={16} className={styles.spinner} aria-hidden="true" />
                    Saving…
                  </>
                ) : status === "published" ? "Save & publish" : "Save draft"}
              </button>
            </div>
          </div>
        </footer>
      </form>
    </dialog>
  )
}
