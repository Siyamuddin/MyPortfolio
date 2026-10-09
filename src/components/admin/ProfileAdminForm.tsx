"use client"

import { useRouter } from "next/navigation"
import { FileUploadField } from "@/components/admin/FileUploadField"
import { AdminForm, Field, TextArea, fieldClassName } from "@/components/admin/AdminForm"
import { upsertProfileAction } from "@/lib/portfolio/admin-actions"
import type { EventOptionRow } from "@/lib/portfolio/admin-data"
import type { ProfileRow } from "@/lib/portfolio/types"

type ProfileAdminFormProps = {
  profile: ProfileRow | null
  events?: EventOptionRow[]
}

export const ProfileAdminForm = ({
  profile,
  events = [],
}: ProfileAdminFormProps) => {
  const router = useRouter()

  const handleAction = async (formData: FormData) => {
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

    return upsertProfileAction(formData)
  }

  const currentFeaturedEventId = profile?.featured_event_id ?? ""
  const eventOptions = events.filter(
    (event) =>
      event.status === "published" || event.id === currentFeaturedEventId
  )

  const socials = profile?.socials ?? {
    github: "",
    linkedin: "",
    googlescholar: "",
    facebook: "",
    youtube: "",
    twitter: "",
  }

  return (
    <AdminForm
      title={profile ? "Edit profile" : "Create profile"}
      action={handleAction}
      onSuccess={() => router.refresh()}
      submitLabel="Save profile"
      fieldsKey={JSON.stringify(profile ?? null)}
    >
      {profile?.id ? <input type="hidden" name="id" value={profile.id} /> : null}
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Name" name="name" required defaultValue={profile?.name ?? ""} />
        <Field label="Title" name="title" required defaultValue={profile?.title ?? ""} />
        <Field label="Email" name="email" type="email" required defaultValue={profile?.email ?? ""} />
        <Field label="Location" name="location" required defaultValue={profile?.location ?? ""} />
      </div>
      <TextArea
        label="Bio (separate paragraphs with a blank line)"
        name="bio_raw"
        rows={8}
        defaultValue={(profile?.bio ?? []).join("\n\n")}
      />
      <Field label="Bio highlight" name="bio_highlight" defaultValue={profile?.bio_highlight ?? ""} />
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
      <label className="block text-sm text-light-gray-70">
        Featured event (Home page spotlight)
        <select
          name="featured_event_id"
          defaultValue={profile?.featured_event_id ?? ""}
          className={fieldClassName}
          aria-label="Featured event"
          tabIndex={0}
        >
          <option value="">None</option>
          {eventOptions.map((event) => (
            <option key={event.id} value={event.id}>
              {event.title}
              {event.status === "published" ? "" : " (draft — not shown)"}
            </option>
          ))}
        </select>
        <span className="mt-1 block text-xs text-light-gray-70">
          Only a published event appears on the home page. Clear this to hide the
          spotlight.
        </span>
      </label>
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
          <Field
            key={key}
            label={key}
            name={`social_${key}`}
            defaultValue={socials[key] ?? ""}
          />
        ))}
      </div>
    </AdminForm>
  )
}
