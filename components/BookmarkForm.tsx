"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import toast from "react-hot-toast"

export default function BookmarkForm({ user }: any) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const addBookmark = async () => {
    if (!title || !url) {
      toast.error("Please fill all fields ❌")
      return
    }

    try {
      setLoading(true)

      const { error } = await supabase.from("bookmarks").insert([
        {
          title,
          url,
          user_id: user.id,
        },
      ])

      if (error) {
        toast.error("Failed to add bookmark ❌")
      } else {
        toast.success("Bookmark added successfully 🚀")
        setTitle("")
        setUrl("")
      }
    } catch {
      toast.error("Something went wrong ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/80 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg p-6 md:p-8 transition-all duration-300 hover:shadow-xl">
      
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
        Add New Bookmark
      </h2>

      <div className="flex flex-col md:flex-row gap-4">

        {/* Title Input */}
        <input
          type="text"
          placeholder="Enter bookmark title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        {/* URL Input */}
        <input
          type="text"
          placeholder="Enter website URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        {/* Add Button */}
        <button
          onClick={addBookmark}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  )
}
