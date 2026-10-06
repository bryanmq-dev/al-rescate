// Every /api/admin/* call needs a logged-in session.
export default defineEventHandler(async (event) => {
  if (event.path.startsWith('/api/admin')) await requireUserSession(event)
})
