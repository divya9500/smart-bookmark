"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import BookmarkList from "@/components/BookmarkList"
import BookmarkForm from "@/components/BookmarkForm"
import toast, { Toaster } from "react-hot-toast"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (!data.user) {
        router.push("/")
      } else {
        setUser(data.user)
      }
    }

    getUser()
  }, [])

  const logout = async () => {
    await supabase.auth.signOut()
    toast.success("Logged out successfully 👋")
    router.push("/")
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-100">

      <Toaster position="top-right" />

      {/* Navbar */}
      <nav className="bg-white shadow-sm px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">
          Smart<span className="text-indigo-600">Bookmark</span>
        </h1>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 hidden md:block">
            {user.email}
          </span>

          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8">

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-slate-700">
            Add Bookmark
          </h2>
          <BookmarkForm user={user} />
        </div>

        <BookmarkList user={user} />
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-6">
        Built with ❤️ using Next.js + Supabase
      </footer>
    </div>
  )
}
