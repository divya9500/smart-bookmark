"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import BookmarkList from "@/components/BookmarkList"
import BookmarkForm from "@/components/BookmarkForm"
import toast, { Toaster } from "react-hot-toast"

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/")
      } else {
        setUser(session.user)
      }

      setLoading(false)
    }

    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          router.push("/")
        } else {
          setUser(session.user)
        }
      }
    )

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
  const channel = supabase
    .channel("test-connection")
    .subscribe((status) => {
      console.log("Realtime status:", status)
    })

  return () => {
    supabase.removeChannel(channel)
  }
}, [])


  const logout = async () => {
    await supabase.auth.signOut()
    toast.success("Logged out successfully 👋")
    router.push("/")
  }

  if (loading) return null
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

      

        <BookmarkList user={user} />
      </div>

      {/* Footer */}
      <footer className="text-center text-gray-500 text-sm py-6">
        Built with ❤️ using Next.js + Supabase
      </footer>
    </div>
  )
}
