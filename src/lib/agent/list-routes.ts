import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { z } from "zod"
import { guardAgentRequest } from "@/lib/agent/auth"
import type { ListTable } from "@/lib/agent/resources"
import {
  createItem,
  deleteItem,
  getById,
  listAll,
  listCreateSchemas,
  listUpdateSchemas,
  updateItem,
} from "@/lib/agent/resources"

const uuidSchema = z.string().uuid()

export const createListCollectionHandlers = (table: ListTable) => {
  const GET = async (request: NextRequest) => {
    const blocked = guardAgentRequest(request)
    if (blocked) return blocked

    const result = await listAll(table)
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status }
      )
    }
    return NextResponse.json({ ok: true, items: result.items })
  }

  const POST = async (request: NextRequest) => {
    const blocked = guardAgentRequest(request)
    if (blocked) return blocked

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 })
    }

    const parsed = listCreateSchemas[table].safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed.", errors: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const result = await createItem(table, parsed.data as Record<string, unknown>)
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status }
      )
    }
    return NextResponse.json({ ok: true, item: result.item }, { status: 201 })
  }

  return { GET, POST }
}

export const createListItemHandlers = (table: ListTable) => {
  const GET = async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const blocked = guardAgentRequest(request)
    if (blocked) return blocked

    const { id } = await context.params
    if (!uuidSchema.safeParse(id).success) {
      return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 })
    }

    const result = await getById(table, id)
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status }
      )
    }
    return NextResponse.json({ ok: true, item: result.item })
  }

  const PUT = async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const blocked = guardAgentRequest(request)
    if (blocked) return blocked

    const { id } = await context.params
    if (!uuidSchema.safeParse(id).success) {
      return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid JSON body." }, { status: 400 })
    }

    const parsed = listUpdateSchemas[table].safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation failed.", errors: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const result = await updateItem(table, id, parsed.data as Record<string, unknown>)
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status }
      )
    }
    return NextResponse.json({ ok: true, item: result.item })
  }

  const DELETE = async (
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
  ) => {
    const blocked = guardAgentRequest(request)
    if (blocked) return blocked

    const { id } = await context.params
    if (!uuidSchema.safeParse(id).success) {
      return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 })
    }

    const result = await deleteItem(table, id)
    if (!result.ok) {
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: result.status }
      )
    }
    return NextResponse.json({ ok: true, deleted: result.deleted })
  }

  return { GET, PUT, DELETE }
}
