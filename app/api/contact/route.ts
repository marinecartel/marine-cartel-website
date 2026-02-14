import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { full_name, email, company, message } = await req.json()

    if (!full_name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    await resend.emails.send({
      from: "Marine Cartel <onboarding@resend.dev>",
      to: "marinecartel9@gmail.com", // 🔴 CHANGE TO YOUR EMAIL
      subject: "New Contact Inquiry - Marine Cartel",
      html: `
        <h2>New Inquiry Received</h2>
        <p><strong>Name:</strong> ${full_name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Company:</strong> ${company}</p>
        <p><strong>Message:</strong> ${message}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 })
  }
}
