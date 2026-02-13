"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import toast from "react-hot-toast"


export default function BookmarkForm({ user }: any) {
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")

const addBookmark = async () => {
  if (!title || !url) {
    toast.error("Please fill all fields")
    return
  }

  const { error } = await supabase.from("bookmarks").insert([
    {
      title,
      url,
      user_id: user.id,
    },
  ])

  if (error) {
    toast.error("Failed to add bookmark")
  } else {
    toast.success("Bookmark added 🚀")
    setTitle("")
    setUrl("")
  }
}


  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mb-8 animate-fadeIn">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Add Bookmark
      </h2>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 outline-none"
        />

        <input
          placeholder="URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-gray-900 outline-none"
        />

        <button
          onClick={addBookmark}
          className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg transition"
        >
          Add
        </button>
      </div>
    </div>
  )
}
