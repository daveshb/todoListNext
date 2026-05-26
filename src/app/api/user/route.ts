export async function GET() {
  return Response.json({
    id: 1,
    name: 'David Henao',
    email: 'david.henao@bblabs.io',
    role: 'admin',
  })
}
