"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import toast from "react-hot-toast"

export default function BookmarkForm({
  user,
  setBookmarks,
  sortOrder,
}: any) {
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

      const { data, error } = await supabase
        .from("bookmarks")
        .insert([
          {
            title,
            url,
            user_id: user.id,
          },
        ])
        .select()

      if (error) {
        toast.error("Failed to add bookmark ❌")
      } else if (data) {
        toast.success("Bookmark added successfully 🚀")

        setBookmarks((prev: any[]) => {
          const updated = [...prev, data[0]]

          return updated.sort((a, b) =>
            sortOrder === "asc"
              ? new Date(a.created_at).getTime() -
                new Date(b.created_at).getTime()
              : new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
          )
        })

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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Add Bookmark
      </h2>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="URL"
          className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />

        <button
          onClick={addBookmark}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  )
}
