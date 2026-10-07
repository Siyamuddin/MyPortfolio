"use client"

import { useRouter } from "next/navigation"
import {
  AdminForm,
  DeleteButton,
  Field,
  TextArea,
  fieldClassName,
} from "@/components/admin/AdminForm"
import { FileUploadField } from "@/components/admin/FileUploadField"
import { TagsInput } from "@/components/admin/TagsInput"
import { labelFromSlug, type Tag } from "@/lib/portfolio/tags"
import {
  deleteItemAction,
  upsertEducationAction,
  upsertExperienceAction,
  upsertFaqAction,
  upsertProjectAction,
  upsertServiceAction,
  upsertSkillAction,
} from "@/lib/portfolio/admin-actions"
import type {
  EducationRow,
  ExperienceRow,
  FaqRow,
  ProjectRow,
  ServiceRow,
  SkillRow,
} from "@/lib/portfolio/types"

const toDefaultTags = (
  slugs: string[] | undefined,
  labels: Record<string, string>
): Tag[] => (slugs ?? []).map((slug) => ({ slug, label: labels[slug] ?? labelFromSlug(slug) }))

export const ServicesAdmin = ({ items }: { items: ServiceRow[] }) => {
  const router = useRouter()
  const refresh = () => router.refresh()

  return (
    <div className="space-y-6">
      <AdminForm title="Add service" action={upsertServiceAction} onSuccess={refresh} fieldsKey={items.length}>
        <Field label="Title" name="title" required />
        <TextArea label="Description" name="description" />
        <Field label="Icon (Smartphone|Code2|Sparkles|Server)" name="icon" defaultValue="Code2" />
        <Field label="Sort order" name="sort_order" type="number" defaultValue={items.length} />
      </AdminForm>

      {items.map((item) => (
        <div key={item.id} className="space-y-2">
          <AdminForm title={`Edit: ${item.title}`} action={upsertServiceAction} onSuccess={refresh} fieldsKey={JSON.stringify(item)}>
            <input type="hidden" name="id" value={item.id} />
            <Field label="Title" name="title" defaultValue={item.title} required />
            <TextArea label="Description" name="description" defaultValue={item.description} />
            <Field label="Icon" name="icon" defaultValue={item.icon} />
            <Field label="Sort order" name="sort_order" type="number" defaultValue={item.sort_order} />
          </AdminForm>
          <DeleteButton
            onDelete={async () => {
              const result = await deleteItemAction("services", item.id)
              if (result.ok) refresh()
              return result
            }}
          />
        </div>
      ))}
    </div>
  )
}

export const SkillsAdmin = ({ items }: { items: SkillRow[] }) => {
  const router = useRouter()
  const refresh = () => router.refresh()

  return (
    <div className="space-y-6">
      <AdminForm title="Add skill" action={upsertSkillAction} onSuccess={refresh} fieldsKey={items.length}>
        <Field label="Name" name="name" required />
        <Field label="Color" name="color" defaultValue="#ffffff" />
        <FileUploadField name="icon" label="Icon stem or URL" folder="skills" type="text" />
        <Field label="Sort order" name="sort_order" type="number" defaultValue={items.length} />
      </AdminForm>

      {items.map((item) => (
        <div key={item.id} className="space-y-2">
          <AdminForm title={`Edit: ${item.name}`} action={upsertSkillAction} onSuccess={refresh} fieldsKey={JSON.stringify(item)}>
            <input type="hidden" name="id" value={item.id} />
            <Field label="Name" name="name" defaultValue={item.name} required />
            <Field label="Color" name="color" defaultValue={item.color} />
            <FileUploadField
              name="icon"
              label="Icon stem or URL"
              folder="skills"
              type="text"
              defaultValue={item.icon}
            />
            <Field label="Sort order" name="sort_order" type="number" defaultValue={item.sort_order} />
          </AdminForm>
          <DeleteButton
            onDelete={async () => {
              const result = await deleteItemAction("skills", item.id)
              if (result.ok) refresh()
              return result
            }}
          />
        </div>
      ))}
    </div>
  )
}

export const EducationAdmin = ({ items }: { items: EducationRow[] }) => {
  const router = useRouter()
  const refresh = () => router.refresh()

  return (
    <div className="space-y-6">
      <AdminForm title="Add education" action={upsertEducationAction} onSuccess={refresh} fieldsKey={items.length}>
        <Field label="School" name="school" required />
        <Field label="Degree" name="degree" required />
        <Field label="Period" name="period" required />
        <TextArea label="Description" name="description" />
        <Field label="Sort order" name="sort_order" type="number" defaultValue={items.length} />
      </AdminForm>

      {items.map((item) => (
        <div key={item.id} className="space-y-2">
          <AdminForm title={`Edit: ${item.school}`} action={upsertEducationAction} onSuccess={refresh} fieldsKey={JSON.stringify(item)}>
            <input type="hidden" name="id" value={item.id} />
            <Field label="School" name="school" defaultValue={item.school} required />
            <Field label="Degree" name="degree" defaultValue={item.degree} required />
            <Field label="Period" name="period" defaultValue={item.period} required />
            <TextArea label="Description" name="description" defaultValue={item.description} />
            <Field label="Sort order" name="sort_order" type="number" defaultValue={item.sort_order} />
          </AdminForm>
          <DeleteButton
            onDelete={async () => {
              const result = await deleteItemAction("education", item.id)
              if (result.ok) refresh()
              return result
            }}
          />
        </div>
      ))}
    </div>
  )
}

export const ExperienceAdmin = ({ items }: { items: ExperienceRow[] }) => {
  const router = useRouter()
  const refresh = () => router.refresh()

  return (
    <div className="space-y-6">
      <ExperienceForm
        title="Add experience"
        sortOrder={items.length}
        onSuccess={refresh}
      />
      {items.map((item) => (
        <div key={item.id} className="space-y-2">
          <ExperienceForm item={item} title={`Edit: ${item.role}`} onSuccess={refresh} />
          <DeleteButton
            onDelete={async () => {
              const result = await deleteItemAction("experience", item.id)
              if (result.ok) refresh()
              return result
            }}
          />
        </div>
      ))}
    </div>
  )
}

const ExperienceForm = ({
  item,
  title,
  sortOrder = 0,
  onSuccess,
}: {
  item?: ExperienceRow
  title: string
  sortOrder?: number
  onSuccess: () => void
}) => {
  const handleAction = async (formData: FormData) => {
    const raw = String(formData.get("highlights_raw") ?? "")
    const highlights = raw
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
    formData.set("highlights", JSON.stringify(highlights))
    return upsertExperienceAction(formData)
  }

  return (
    <AdminForm
      title={title}
      action={handleAction}
      onSuccess={onSuccess}
      fieldsKey={item ? JSON.stringify(item) : sortOrder}
    >
      {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
      <Field label="Role" name="role" defaultValue={item?.role} required />
      <Field label="Company" name="company" defaultValue={item?.company} required />
      <Field label="Period" name="period" defaultValue={item?.period} required />
      <Field label="Location" name="location" defaultValue={item?.location ?? ""} />
      <label className="block text-sm text-light-gray-70">
        Highlights (one per line)
        <textarea
          name="highlights_raw"
          rows={6}
          defaultValue={(item?.highlights ?? []).join("\n")}
          className={fieldClassName}
          aria-label="Highlights"
          tabIndex={0}
        />
      </label>
      <Field
        label="Sort order"
        name="sort_order"
        type="number"
        defaultValue={item?.sort_order ?? sortOrder}
      />
    </AdminForm>
  )
}

export const ProjectsAdmin = ({
  items,
  tagLabels = {},
}: {
  items: ProjectRow[]
  tagLabels?: Record<string, string>
}) => {
  const router = useRouter()
  const refresh = () => router.refresh()

  return (
    <div className="space-y-6">
      <AdminForm title="Add project" action={upsertProjectAction} onSuccess={refresh} fieldsKey={items.length}>
        <Field label="Title" name="title" required />
        <label className="block text-sm text-light-gray-70">
          Category
          <select
            name="category"
            defaultValue="Web Development"
            className={fieldClassName}
            aria-label="Category"
            tabIndex={0}
          >
            <option value="Web Development">Web Development</option>
            <option value="Applications">Applications</option>
            <option value="Automation">Automation</option>
          </select>
        </label>
        <FileUploadField name="image" label="Image" folder="projects" />
        <Field label="URL" name="url" defaultValue="" />
        <TextArea label="Description" name="description" />
        <TagsInput />
        <Field label="Social image URL (optional)" name="og_image" defaultValue="" />
        <Field label="Sort order" name="sort_order" type="number" defaultValue={items.length} />
      </AdminForm>

      {items.map((item) => (
        <div key={item.id} className="space-y-2">
          <AdminForm title={`Edit: ${item.title}`} action={upsertProjectAction} onSuccess={refresh} fieldsKey={JSON.stringify(item)}>
            <input type="hidden" name="id" value={item.id} />
            <Field label="Title" name="title" defaultValue={item.title} required />
            <label className="block text-sm text-light-gray-70">
              Category
              <select
                name="category"
                defaultValue={item.category}
                className={fieldClassName}
                aria-label="Category"
                tabIndex={0}
              >
                <option value="Web Development">Web Development</option>
                <option value="Applications">Applications</option>
                <option value="Automation">Automation</option>
              </select>
            </label>
            <FileUploadField name="image" label="Image" folder="projects" defaultValue={item.image} />
            <Field label="URL" name="url" defaultValue={item.url} />
            <TextArea label="Description" name="description" defaultValue={item.description} />
            <TagsInput defaultTags={toDefaultTags(item.tags, tagLabels)} />
            <Field label="Social image URL (optional)" name="og_image" defaultValue={item.og_image ?? ""} />
            <Field label="Sort order" name="sort_order" type="number" defaultValue={item.sort_order} />
          </AdminForm>
          <DeleteButton
            onDelete={async () => {
              const result = await deleteItemAction("projects", item.id)
              if (result.ok) refresh()
              return result
            }}
          />
        </div>
      ))}
    </div>
  )
}

export const FaqAdmin = ({ items }: { items: FaqRow[] }) => {
  const router = useRouter()
  const refresh = () => router.refresh()

  return (
    <div className="space-y-6">
      <AdminForm title="Add FAQ" action={upsertFaqAction} onSuccess={refresh} fieldsKey={items.length}>
        <Field label="Question" name="question" required />
        <TextArea label="Answer" name="answer" rows={5} />
        <Field label="Sort order" name="sort_order" type="number" defaultValue={items.length} />
      </AdminForm>

      {items.map((item) => (
        <div key={item.id} className="space-y-2">
          <AdminForm title={`Edit FAQ`} action={upsertFaqAction} onSuccess={refresh} fieldsKey={JSON.stringify(item)}>
            <input type="hidden" name="id" value={item.id} />
            <Field label="Question" name="question" defaultValue={item.question} required />
            <TextArea label="Answer" name="answer" defaultValue={item.answer} rows={5} />
            <Field label="Sort order" name="sort_order" type="number" defaultValue={item.sort_order} />
          </AdminForm>
          <DeleteButton
            onDelete={async () => {
              const result = await deleteItemAction("faqs", item.id)
              if (result.ok) refresh()
              return result
            }}
          />
        </div>
      ))}
    </div>
  )
}
