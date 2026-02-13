"use client"

import { useEffect, useRef, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import toast from "react-hot-toast"

export default function BookmarkList({ user }: any) {
  const [bookmarks, setBookmarks] = useState<any[]>([])
  const [sortOrder, setSortOrder] = useState("desc")
  const channelRef = useRef<any>(null)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editUrl, setEditUrl] = useState("")

  // 🔹 Fetch Bookmarks
  const fetchBookmarks = async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: sortOrder === "asc" })

    if (error) {
      toast.error("Failed to load bookmarks ❌")
    } else {
      setBookmarks(data || [])
    }
  }

  // 🔹 Update Bookmark
  const updateBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .update({ title: editTitle, url: editUrl })
      .eq("id", id)

    if (error) {
      toast.error("Failed to update ❌")
    } else {
      toast.success("Bookmark updated ✏️")
      setEditingId(null)
    }
  }

  // 🔹 Delete Bookmark
  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)

    if (error) {
      toast.error("Failed to delete ❌")
    } else {
      toast.success("Bookmark deleted 🗑️")
    }
  }

  // 🔹 Realtime
  useEffect(() => {
    if (!user) return

    fetchBookmarks()

    const channel = supabase
      .channel("realtime-bookmarks")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
        },
        () => {
          fetchBookmarks()
        }
      )
      .subscribe()

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [user, sortOrder])

  // 🔹 Empty State
  if (bookmarks.length === 0) {
    return (
      <div className="bg-white p-10 rounded-xl shadow-sm text-center">
        <div className="text-gray-400 text-5xl mb-4">📌</div>
        <h3 className="text-lg font-semibold text-gray-700">
          No bookmarks yet
        </h3>
        <p className="text-gray-500 text-sm mt-2">
          Start by adding your first bookmark above.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sorting */}
      <div className="flex justify-end">
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border px-3 py-2 rounded-lg bg-white shadow-sm"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* Bookmark List */}
  {bookmarks.map((bookmark) => {
  let domain = ""

  try {
    const validUrl = bookmark.url.startsWith("http")
      ? bookmark.url
      : `https://${bookmark.url}`

    domain = new URL(validUrl).hostname
  } catch {
    domain = ""
  }

  return (
    <div
      key={bookmark.id}
      className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start gap-3 w-full">

        {/* Favicon */}
        {domain && (
          <img
            src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
            alt="favicon"
            className="w-6 h-6 mt-1"
          />
        )}

        <div className="flex-1">

          {editingId === bookmark.id ? (
            <div className="flex flex-col gap-2">
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border px-3 py-2 rounded-lg"
              />

              <input
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                className="border px-3 py-2 rounded-lg"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => updateBookmark(bookmark.id)}
                  className="text-green-600 text-sm font-medium"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingId(null)}
                  className="text-gray-500 text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="font-semibold text-gray-800">
                {bookmark.title}
              </h3>

              <a
                href={
                  bookmark.url.startsWith("http")
                    ? bookmark.url
                    : `https://${bookmark.url}`
                }
                target="_blank"
                className="text-gray-500 text-sm hover:text-blue-600 transition"
              >
                {bookmark.url}
              </a>
            </>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      {editingId !== bookmark.id && (
        <div className="flex gap-4 ml-4">
          <button
            onClick={() => {
              setEditingId(bookmark.id)
              setEditTitle(bookmark.title)
              setEditUrl(bookmark.url)
            }}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            Edit
          </button>

          <button
            onClick={() => {
              if (confirm("Delete this bookmark?")) {
                deleteBookmark(bookmark.id)
              }
            }}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  )
})}


    </div>
  )
}
