const { createClient } = require("@supabase/supabase-js")
const { execFileSync } = require("child_process")
const fs = require("fs")
const path = require("path")

for (const line of fs.readFileSync(path.join(process.cwd(), ".env.local"), "utf8").split("\n")) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith("#")) continue
  const i = trimmed.indexOf("=")
  if (i === -1) continue
  const key = trimmed.slice(0, i)
  const value = trimmed.slice(i + 1)
  if (!process.env[key]) process.env[key] = value
}

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const out = execFileSync(
  "npx",
  [
    "tsx",
    "-e",
    `import * as p from './src/data/portfolio.ts'; console.log(JSON.stringify({ profile: p.profile, services: p.services, skills: p.skills, education: p.education, experience: p.experience, projects: p.projects, blogPosts: p.blogPosts }))`,
  ],
  { encoding: "utf8", cwd: process.cwd() }
)
const staticData = JSON.parse(out.trim().split("\n").filter(Boolean).at(-1))

async function wipe(table) {
  const { error } = await admin
    .from(table)
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000")
  if (error) throw new Error(`${table} wipe: ${error.message}`)
}

;(async () => {
  const { error: probe } = await admin.from("profile").select("id").limit(1)
  if (probe) {
    console.error("Schema not applied:", probe.message)
    process.exit(2)
  }
  for (const table of ["services", "skills", "education", "experience", "projects", "blog_posts", "profile"]) {
    await wipe(table)
  }
  const { error: profileError } = await admin.from("profile").insert({
    name: staticData.profile.name,
    title: staticData.profile.title,
    email: staticData.profile.email,
    location: staticData.profile.location,
    bio: staticData.profile.bio,
    bio_highlight: staticData.profile.bioHighlight,
    socials: staticData.profile.socials,
    avatar: staticData.profile.avatar,
    resume_url: staticData.profile.resumeUrl ?? null,
  })
  if (profileError) throw new Error(profileError.message)
  const inserts = [
    ["services", staticData.services.map((item, index) => ({ title: item.title, description: item.description, icon: item.icon, sort_order: index }))],
    ["skills", staticData.skills.map((item, index) => ({ name: item.name, color: item.color, icon: item.icon, sort_order: index }))],
    ["education", staticData.education.map((item, index) => ({ school: item.school, degree: item.degree, period: item.period, description: item.description, sort_order: index }))],
    ["experience", staticData.experience.map((item, index) => ({ role: item.role, company: item.company, period: item.period, location: item.location, highlights: item.highlights, sort_order: index }))],
    ["projects", staticData.projects.map((item, index) => ({ title: item.title, category: item.category, image: item.image, url: item.url, description: item.description, sort_order: index }))],
    ["blog_posts", staticData.blogPosts.map((item, index) => ({ title: item.title, category: item.category, date: item.date, date_time: item.dateTime, excerpt: item.excerpt, image: item.image, url: item.url, sort_order: index }))],
  ]
  for (const [table, rows] of inserts) {
    const { error } = await admin.from(table).insert(rows)
    if (error) throw new Error(`${table}: ${error.message}`)
    console.log(`inserted ${rows.length} into ${table}`)
  }
  console.log("Seed complete")
})().catch((e) => {
  console.error(e.message || e)
  process.exit(1)
})
