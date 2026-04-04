"use client"
import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr" // Isse replace karein
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  
  const router = useRouter()

  // Browser Client initialize karein
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("Checking credentials...")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setMessage("❌ Error: " + error.message)
        setLoading(false)
        return
      }

      if (data.user) {
        setMessage("✅ Login Success! Redirecting...")
        
        // Force refresh zaroori hai taaki proxy.ts ko session mil jaye
        router.push("/admin/dashboard")
        setTimeout(() => {
            window.location.reload(); // Hard refresh for session sync
        }, 500);
      }
    } catch (err) {
      setMessage("Something went wrong.")
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-lg w-96 border border-gray-200">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-800">Marine Cartel</h1>
        <p className="text-center text-gray-500 mb-6 text-sm">Admin Access Only</p>
        
        {message && (
          <div className={`p-3 mb-4 rounded text-sm text-center ${message.includes('❌') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message}
          </div>
        )}

        <div className="space-y-4">
          <input 
            type="email" 
            placeholder="Admin Email" 
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            disabled={loading}
            className="w-full bg-slate-900 text-white p-3 rounded-lg font-semibold hover:bg-slate-800 disabled:bg-gray-400"
          >
            {loading ? "Verifying..." : "Sign In"}
          </button>
        </div>
      </form>
    </div>
  )
}