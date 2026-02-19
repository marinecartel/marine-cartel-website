import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { password } = await req.json()

  console.log("Entered:", password)
  console.log("ENV:", process.env.ADMIN_SECRET)

  if (password === process.env.ADMIN_SECRET) {
    const response = NextResponse.json({ success: true })

    response.cookies.set("admin-auth", password, {
      httpOnly: true,
      secure: false, // IMPORTANT change
      path: "/",
    })

    return response
  }

  return NextResponse.json({ success: false }, { status: 401 })
}
