"use client"

import { useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        router.push("/dashboard")
      }
    }

    checkSession()
  }, [router])

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6">
        <h1 className="text-2xl font-bold tracking-wide">
          Smart<span className="text-indigo-400">Bookmark</span>
        </h1>
        <button
          onClick={signIn}
          className="bg-white text-black px-5 py-2 rounded-lg font-medium hover:scale-105 transition"
        >
          Sign in with Google
        </button>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-1 flex-col justify-center items-center text-center px-6">
        <h2 className="text-5xl md:text-6xl font-bold leading-tight">
          Organize Your Web <br />
          <span className="text-indigo-400">Beautifully</span>
        </h2>

        <p className="mt-6 text-gray-400 max-w-xl text-lg">
          A real-time, secure bookmark manager built with modern technology.
          Sync across tabs instantly.
        </p>

        <button
          onClick={signIn}
          className="mt-10 bg-indigo-500 hover:bg-indigo-600 px-8 py-4 rounded-xl text-lg font-semibold transition shadow-lg hover:shadow-indigo-500/40"
        >
          Get Started Free
        </button>
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-6 border-t border-slate-800">
        © {new Date().getFullYear()} SmartBookmark.
      </footer>
    </div>
  )
}
