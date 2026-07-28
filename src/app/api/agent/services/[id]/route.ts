import { createListItemHandlers } from "@/lib/agent/list-routes"

export const { GET, PUT, DELETE } = createListItemHandlers("services")
