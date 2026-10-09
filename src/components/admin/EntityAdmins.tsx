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

const deleteAndRefresh = (table: string, id: string, refresh: () => void) => async () => {
  const result = await deleteItemAction(table, id)
  if (result.ok) refresh()
  return result
}

export const ServicesAdmin = ({ items }: { items: ServiceRow[] }) => {
  const router = useRouter()
  const refresh = () => router.refresh()

  return (
    <div className="space-y-6">
      <ServiceForm title="Add service" sortOrder={items.length} onSuccess={refresh} />
      {items.map((item) => (
        <div key={item.id} className="space-y-2">
          <ServiceForm item={item} title={`Edit: ${item.title}`} onSuccess={refresh} />
          <DeleteButton onDelete={deleteAndRefresh("services", item.id, refresh)} />
        </div>
      ))}
    </div>
  )
}

const ServiceForm = ({ item, title, sortOrder = 0, onSuccess }: {
  item?: ServiceRow
  title: string
  sortOrder?: number
  onSuccess: () => void
}) => (
  <AdminForm
    title={title}
    action={upsertServiceAction}
    onSuccess={onSuccess}
    fieldsKey={item ? JSON.stringify(item) : sortOrder}
  >
    {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
    <Field label="Title" name="title" defaultValue={item?.title} required />
    <TextArea label="Description" name="description" defaultValue={item?.description} />
    <Field
      label={item ? "Icon" : "Icon (Smartphone|Code2|Sparkles|Server)"}
      name="icon"
      defaultValue={item ? item.icon : "Code2"}
    />
    <Field label="Sort order" name="sort_order" type="number" defaultValue={item ? item.sort_order : sortOrder} />
  </AdminForm>
)

export const SkillsAdmin = ({ items }: { items: SkillRow[] }) => {
  const router = useRouter()
  const refresh = () => router.refresh()

  return (
    <div className="space-y-6">
      <SkillForm title="Add skill" sortOrder={items.length} onSuccess={refresh} />
      {items.map((item) => (
        <div key={item.id} className="space-y-2">
          <SkillForm item={item} title={`Edit: ${item.name}`} onSuccess={refresh} />
          <DeleteButton onDelete={deleteAndRefresh("skills", item.id, refresh)} />
        </div>
      ))}
    </div>
  )
}

const SkillForm = ({ item, title, sortOrder = 0, onSuccess }: {
  item?: SkillRow
  title: string
  sortOrder?: number
  onSuccess: () => void
}) => (
  <AdminForm
    title={title}
    action={upsertSkillAction}
    onSuccess={onSuccess}
    fieldsKey={item ? JSON.stringify(item) : sortOrder}
  >
    {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
    <Field label="Name" name="name" defaultValue={item?.name} required />
    <Field label="Color" name="color" defaultValue={item ? item.color : "#ffffff"} />
    <FileUploadField name="icon" label="Icon stem or URL" folder="skills" type="text" defaultValue={item?.icon} />
    <Field label="Sort order" name="sort_order" type="number" defaultValue={item ? item.sort_order : sortOrder} />
  </AdminForm>
)

export const EducationAdmin = ({ items }: { items: EducationRow[] }) => {
  const router = useRouter()
  const refresh = () => router.refresh()

  return (
    <div className="space-y-6">
      <EducationForm title="Add education" sortOrder={items.length} onSuccess={refresh} />
      {items.map((item) => (
        <div key={item.id} className="space-y-2">
          <EducationForm item={item} title={`Edit: ${item.school}`} onSuccess={refresh} />
          <DeleteButton onDelete={deleteAndRefresh("education", item.id, refresh)} />
        </div>
      ))}
    </div>
  )
}

const EducationForm = ({ item, title, sortOrder = 0, onSuccess }: {
  item?: EducationRow
  title: string
  sortOrder?: number
  onSuccess: () => void
}) => (
  <AdminForm
    title={title}
    action={upsertEducationAction}
    onSuccess={onSuccess}
    fieldsKey={item ? JSON.stringify(item) : sortOrder}
  >
    {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
    <Field label="School" name="school" defaultValue={item?.school} required />
    <Field label="Degree" name="degree" defaultValue={item?.degree} required />
    <Field label="Period" name="period" defaultValue={item?.period} required />
    <TextArea label="Description" name="description" defaultValue={item?.description} />
    <Field label="Sort order" name="sort_order" type="number" defaultValue={item ? item.sort_order : sortOrder} />
  </AdminForm>
)

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
          <DeleteButton onDelete={deleteAndRefresh("experience", item.id, refresh)} />
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
      <ProjectForm title="Add project" sortOrder={items.length} tagLabels={tagLabels} onSuccess={refresh} />
      {items.map((item) => (
        <div key={item.id} className="space-y-2">
          <ProjectForm item={item} title={`Edit: ${item.title}`} tagLabels={tagLabels} onSuccess={refresh} />
          <DeleteButton onDelete={deleteAndRefresh("projects", item.id, refresh)} />
        </div>
      ))}
    </div>
  )
}

const ProjectForm = ({ item, title, sortOrder = 0, tagLabels, onSuccess }: {
  item?: ProjectRow
  title: string
  sortOrder?: number
  tagLabels: Record<string, string>
  onSuccess: () => void
}) => (
  <AdminForm
    title={title}
    action={upsertProjectAction}
    onSuccess={onSuccess}
    fieldsKey={item ? JSON.stringify(item) : sortOrder}
  >
    {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
    <Field label="Title" name="title" defaultValue={item?.title} required />
    <label className="block text-sm text-light-gray-70">
      Category
      <select
        name="category"
        defaultValue={item?.category ?? "Web Development"}
        className={fieldClassName}
        aria-label="Category"
        tabIndex={0}
      >
        <option value="Web Development">Web Development</option>
        <option value="Applications">Applications</option>
        <option value="Automation">Automation</option>
      </select>
    </label>
    <FileUploadField name="image" label="Image" folder="projects" defaultValue={item?.image} />
    <Field label="URL" name="url" defaultValue={item?.url ?? ""} />
    <TextArea label="Description" name="description" defaultValue={item?.description} />
    <TagsInput defaultTags={item ? toDefaultTags(item.tags, tagLabels) : []} />
    <Field label="Sort order" name="sort_order" type="number" defaultValue={item ? item.sort_order : sortOrder} />
  </AdminForm>
)

export const FaqAdmin = ({ items }: { items: FaqRow[] }) => {
  const router = useRouter()
  const refresh = () => router.refresh()

  return (
    <div className="space-y-6">
      <FaqForm title="Add FAQ" sortOrder={items.length} onSuccess={refresh} />
      {items.map((item) => (
        <div key={item.id} className="space-y-2">
          <FaqForm item={item} title="Edit FAQ" onSuccess={refresh} />
          <DeleteButton onDelete={deleteAndRefresh("faqs", item.id, refresh)} />
        </div>
      ))}
    </div>
  )
}

const FaqForm = ({ item, title, sortOrder = 0, onSuccess }: {
  item?: FaqRow
  title: string
  sortOrder?: number
  onSuccess: () => void
}) => (
  <AdminForm
    title={title}
    action={upsertFaqAction}
    onSuccess={onSuccess}
    fieldsKey={item ? JSON.stringify(item) : sortOrder}
  >
    {item?.id ? <input type="hidden" name="id" value={item.id} /> : null}
    <Field label="Question" name="question" defaultValue={item?.question} required />
    <TextArea label="Answer" name="answer" defaultValue={item?.answer} rows={5} />
    <Field label="Sort order" name="sort_order" type="number" defaultValue={item ? item.sort_order : sortOrder} />
  </AdminForm>
)
