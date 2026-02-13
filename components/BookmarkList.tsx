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

  // 🔹 Update
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

  // 🔹 Delete
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
      <div className="bg-white p-12 rounded-2xl shadow-sm text-center border border-gray-100">
        <div className="text-6xl mb-4">📌</div>
        <h3 className="text-xl font-semibold text-gray-800">
          No bookmarks yet
        </h3>
        <p className="text-gray-500 mt-2">
          Start building your collection by adding your first bookmark.
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
          className="px-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {/* Bookmark Cards */}
      <div className="grid gap-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-start gap-3">

                {domain && (
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                    alt="favicon"
                    className="w-8 h-8"
                  />
                )}

                <div className="flex-1">

                  {editingId === bookmark.id ? (
                    <div className="space-y-3">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm"
                      />
                      <input
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        className="w-full border border-gray-200 px-3 py-2 rounded-lg text-sm"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={() => updateBookmark(bookmark.id)}
                          className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="text-gray-500 text-sm hover:text-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h3 className="font-semibold text-gray-900 text-base">
                        {bookmark.title}
                      </h3>

                      <a
                        href={
                          bookmark.url.startsWith("http")
                            ? bookmark.url
                            : `https://${bookmark.url}`
                        }
                        target="_blank"
                        className="text-gray-500 text-sm hover:text-indigo-600 break-all"
                      >
                        {bookmark.url}
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              {editingId !== bookmark.id && (
                <div className="flex justify-end gap-4 mt-5">
                  <button
                    onClick={() => {
                      setEditingId(bookmark.id)
                      setEditTitle(bookmark.title)
                      setEditUrl(bookmark.url)
                    }}
                    className="text-indigo-600 text-sm hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      if (confirm("Delete this bookmark?")) {
                        deleteBookmark(bookmark.id)
                      }
                    }}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
