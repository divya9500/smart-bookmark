"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import BookmarkForm from "@/components/BookmarkForm"
import BookmarkList from "@/components/BookmarkList"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Navbar */}
      <nav className="bg-white border-b shadow-sm px-8 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">
          SmartBookmark
        </div>

        <div className="flex items-center gap-6">
          <span className="text-gray-600 text-sm">
            {user.email}
          </span>

          <button
            onClick={handleLogout}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-10">
        <BookmarkForm user={user} />
        <BookmarkList user={user} />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} SmartBookmark. All rights reserved.
      </footer>

    </div>
  )
}
