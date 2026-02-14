"use client"

import { useState } from "react"

export default function ContactForm() {
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()

  const form = e.currentTarget   // ✅ store reference first
  setLoading(true)

  const formData = new FormData(form)

  const res = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      full_name: formData.get("full_name"),
      email: formData.get("email"),
      company: formData.get("company"),
      message: formData.get("message"),
    }),
  })

  setLoading(false)

  if (res.ok) {
    alert("Inquiry sent successfully!")
    form.reset()   // ✅ now safe
  } else {
    alert("Something went wrong.")
  }
}


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <input
        name="full_name"
        placeholder="Full Name"
        required
        className="w-full p-4 border rounded-lg"
      />

      <input
        name="email"
        type="email"
        placeholder="Business Email"
        required
        className="w-full p-4 border rounded-lg"
      />

      <input
        name="company"
        placeholder="Company Name"
        className="w-full p-4 border rounded-lg"
      />

      <textarea
        name="message"
        placeholder="Your Message"
        required
        rows={5}
        className="w-full p-4 border rounded-lg"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0F766E] text-white py-4 rounded-lg font-bold"
      >
        {loading ? "Sending..." : "Send Enquiry"}
      </button>
    </form>
  )
}
