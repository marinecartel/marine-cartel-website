import { NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY || "")

export async function POST(req: Request) {
  try {
    const {
      orderId,
      customerName,
      companyName,
      email,
      phone,
      address,
      partNumber,
      productTitle,
      amount,
      paymentMethod,
    } = await req.json()

    if (!orderId || !customerName || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await resend.emails.send({
      from: "Marine Cartel Orders <onboarding@resend.dev>",
      to: "marinecartel9@gmail.com",
      subject: `🚨 New Order Alert: #${orderId} - $${amount} USD (${partNumber})`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; color: #0f172a; max-width: 620px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          
          <div style="border-bottom: 2px solid #0F766E; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="color: #0F766E; margin: 0; font-size: 20px;">🚨 New Order Received!</h2>
            <p style="color: #64748b; font-size: 13px; margin: 4px 0 0 0;">An order has been placed on Marine Cartel.</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 13px;">
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0; width: 35%;">Order ID:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; color: #0F766E;">#${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Product Title:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${productTitle}</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Part / Model No:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold;">${partNumber}</td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Order Amount:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 16px; color: #0F766E; font-weight: bold;">$${amount} USD</td>
            </tr>
            <tr style="background: #f8fafc;">
              <td style="padding: 10px; font-weight: bold; border-bottom: 1px solid #e2e8f0;">Payment Rails:</td>
              <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${paymentMethod}</td>
            </tr>
          </table>

          <h3 style="color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Customer & Delivery Details</h3>
          <div style="background-color: #f8fafc; padding: 14px; border-radius: 12px; font-size: 13px; line-height: 1.6;">
            <p style="margin: 0;"><strong>Customer Name:</strong> ${customerName}</p>
            <p style="margin: 0;"><strong>Company:</strong> ${companyName || "Individual / Not Provided"}</p>
            <p style="margin: 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #0F766E;">${email}</a></p>
            <p style="margin: 0;"><strong>Phone / WhatsApp:</strong> <a href="tel:${phone}" style="color: #0F766E;">${phone}</a></p>
            <p style="margin: 0;"><strong>Shipping Destination:</strong> ${address}</p>
          </div>

          <div style="margin-top: 20px; padding: 14px; background: #f0fdf4; border-radius: 12px; border: 1px solid #bbf7d0; font-size: 12px; color: #166534;">
            <strong>Next Action:</strong> Send Proforma Invoice / Bank Wire details to buyer's email, or message them directly on WhatsApp at <a href="https://wa.me/${phone.replace(/[^0-9]/g, "")}" style="color: #166534; font-weight: bold;">${phone}</a>.
          </div>

        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Order alert email failed:", error)
    return NextResponse.json({ error: "Failed to send email alert" }, { status: 500 })
  }
}