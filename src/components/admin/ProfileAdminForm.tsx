"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { FileUploadField } from "@/components/admin/FileUploadField"
import { fieldClassName } from "@/components/admin/AdminForm"
import { upsertProfileAction } from "@/lib/portfolio/admin-actions"
import type { ProfileRow } from "@/lib/portfolio/types"

type ProfileAdminFormProps = {
  profile: ProfileRow | null
}

export const ProfileAdminForm = ({ profile }: ProfileAdminFormProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (formData: FormData) => {
    const bioRaw = String(formData.get("bio_raw") ?? "")
    const bio = bioRaw
      .split(/\n\s*\n/)
      .map((part) => part.trim())
      .filter(Boolean)
    formData.set("bio", JSON.stringify(bio))

    const socials = {
      github: String(formData.get("social_github") ?? ""),
      linkedin: String(formData.get("social_linkedin") ?? ""),
      googlescholar: String(formData.get("social_googlescholar") ?? ""),
      facebook: String(formData.get("social_facebook") ?? ""),
      youtube: String(formData.get("social_youtube") ?? ""),
      twitter: String(formData.get("social_twitter") ?? ""),
    }
    formData.set("socials", JSON.stringify(socials))

    startTransition(async () => {
      const result = await upsertProfileAction(formData)
      if (result.ok) {
        setError(null)
        setMessage("Saved")
        router.refresh()
        return
      }
      setMessage(null)
      setError(result.error ?? "Save failed")
    })
  }

  const socials = profile?.socials ?? {
    github: "",
    linkedin: "",
    googlescholar: "",
    facebook: "",
    youtube: "",
    twitter: "",
  }

  return (
    <form
      action={handleSubmit}
      className="space-y-4 rounded-2xl border border-jet bg-eerie-black-2 p-5"
      aria-label="Edit profile"
    >
      <h3 className="text-base text-white-2">
        {profile ? "Edit profile" : "Create profile"}
      </h3>
      {profile?.id ? <input type="hidden" name="id" value={profile.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm text-light-gray-70">
          Name
          <input
            name="name"
            required
            defaultValue={profile?.name ?? ""}
            className={fieldClassName}
            aria-label="Name"
            tabIndex={0}
          />
        </label>
        <label className="block text-sm text-light-gray-70">
          Title
          <input
            name="title"
            required
            defaultValue={profile?.title ?? ""}
            className={fieldClassName}
            aria-label="Title"
            tabIndex={0}
          />
        </label>
        <label className="block text-sm text-light-gray-70">
          Email
          <input
            type="email"
            name="email"
            required
            defaultValue={profile?.email ?? ""}
            className={fieldClassName}
            aria-label="Email"
            tabIndex={0}
          />
        </label>
        <label className="block text-sm text-light-gray-70">
          Location
          <input
            name="location"
            required
            defaultValue={profile?.location ?? ""}
            className={fieldClassName}
            aria-label="Location"
            tabIndex={0}
          />
        </label>
      </div>
      <label className="block text-sm text-light-gray-70">
        Bio (separate paragraphs with a blank line)
        <textarea
          name="bio_raw"
          rows={8}
          defaultValue={(profile?.bio ?? []).join("\n\n")}
          className={fieldClassName}
          aria-label="Bio"
          tabIndex={0}
        />
      </label>
      <label className="block text-sm text-light-gray-70">
        Bio highlight
        <input
          name="bio_highlight"
          defaultValue={profile?.bio_highlight ?? ""}
          className={fieldClassName}
          aria-label="Bio highlight"
          tabIndex={0}
        />
      </label>
      <FileUploadField
        name="avatar"
        label="Avatar URL / upload"
        folder="avatars"
        defaultValue={profile?.avatar ?? ""}
      />
      <FileUploadField
        name="resume_url"
        label="Resume URL / upload"
        folder="resume"
        defaultValue={profile?.resume_url ?? ""}
        accept=".pdf,application/pdf"
      />
      <div className="grid gap-4 md:grid-cols-2">
        {(
          [
            "github",
            "linkedin",
            "googlescholar",
            "facebook",
            "youtube",
            "twitter",
          ] as const
        ).map((key) => (
          <label key={key} className="block text-sm text-light-gray-70">
            {key}
            <input
              name={`social_${key}`}
              defaultValue={socials[key] ?? ""}
              className={fieldClassName}
              aria-label={key}
              tabIndex={0}
            />
          </label>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-gold px-4 py-2 text-sm font-medium text-eerie-black-1 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
          aria-label="Save profile"
        >
          {isPending ? "Saving…" : "Save profile"}
        </button>
        {message ? (
          <span className="text-sm text-emerald-400" role="status">
            {message}
          </span>
        ) : null}
        {error ? (
          <span className="text-sm text-red-400" role="alert">
            {error}
          </span>
        ) : null}
      </div>
    </form>
  )
}
