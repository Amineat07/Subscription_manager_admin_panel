import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "../../utils/Toast";
import { useNavigate } from "react-router-dom";
import type { NewsFeed } from "../Models/NewsFeed";

export default function NewsFeedPage() {
  const [items, setItems] = useState<NewsFeed[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    fetchNews();

    const es = new EventSource(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/sse/newsfeed`,
        { withCredentials: true }
    );

    es.addEventListener("created", (e) => {
        const newItem: NewsFeed = JSON.parse(e.data)
        setItems(prev => [newItem, ...prev])
    })

    es.addEventListener("published", (e) => {
        const updatedItem: NewsFeed = JSON.parse(e.data)
        setItems(prev =>
            prev.map(item =>
                item.id === updatedItem.id ? updatedItem : item
            )
        )
    })

    es.onerror = () => es.close()

    return () => es.close()
}, [])

  async function fetchNews() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/newsfeed`,
        { withCredentials: true }
      );
      setItems(res.data);
    } catch {
      toast.error("Failed to load news feed");
    } finally {
      setFetching(false);
    }
  }

  async function createNews() {
    if (!title || !content) {
      toast.error("Title and content required");
      return;
    }
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/newsfeed`,
        {
          title,
          content,
          image_url: imageUrl || "",
          scheduled_at: scheduledAt ? new Date(scheduledAt) : null,
          is_published: false,
        },
        { withCredentials: true }
      );
      toast.success("News created");
      setOpen(false);
      setTitle("");
      setContent("");
      setImageUrl("");
      setScheduledAt("");
    } catch {
      toast.error("Create failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const confirm = await toast.danger("Delete news?", "");
    if (!confirm.isConfirmed) return;
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/admin/newsfeed/${id}`, {
      withCredentials: true,
    });
    setItems((prev) => prev.filter((n) => n.id !== id));
    toast.success("Deleted");
  }

  const now = new Date();
  const monthLabel = now.toLocaleString("en-GB", { month: "long", year: "numeric" });

  const published = items.filter(n => n.is_published).length;
  const drafts = items.filter(n => !n.is_published).length;
  const scheduled = items.filter(n => n.scheduled_at && !n.is_published).length;

  return (
    <div className="p-6 bg-[#EAEAEA] min-h-screen">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1A1A]">News Feed</h1>
          <p className="text-xs text-[#888]">
            {monthLabel} · Manage platform announcements
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="cursor-pointer px-4 py-2 bg-[#42B883] text-white rounded-lg hover:bg-[#2D8A63] transition text-sm"
        >
          + Create news
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Total posts</p>
          <p className="text-2xl font-semibold text-[#1A1A1A]">{items.length}</p>
        </div>
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Published</p>
          <p className="text-2xl font-semibold text-[#42B883]">{published}</p>
        </div>
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Drafts</p>
          <p className="text-2xl font-semibold text-[#B07D2A]">{drafts}</p>
        </div>
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Scheduled</p>
          <p className="text-2xl font-semibold text-[#6366F1]">{scheduled}</p>
        </div>
      </div>

      <div className="bg-white border border-[#D8D8D8] rounded-xl overflow-hidden">

        <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr_auto] px-4 py-3 bg-[#F9F9F9] border-b border-[#E8E8E8]">
          {["Title", "Status", "Scheduled", "Created"].map(label => (
            <span key={label} className="text-[11px] uppercase text-[#888]">{label}</span>
          ))}
          <span className="text-[11px] uppercase text-[#888] text-right">Actions</span>
        </div>

        {fetching ? (
          <div className="text-center text-[#888] py-16 text-sm">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center text-[#888] py-16 text-sm">No news posts yet.</div>
        ) : (
          items.map((n) => (
            <div
              key={n.id}
              className="grid grid-cols-[2fr_1fr_1.5fr_1fr_auto] px-4 py-3 border-t border-[#F0F0F0] items-center hover:bg-[#F9F9F9] transition"
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                  style={{
                    background: n.is_published ? "#42B88320" : "#B07D2A20",
                    color: n.is_published ? "#42B883" : "#B07D2A",
                  }}
                >
                  {n.title.slice(0, 2).toUpperCase()}
                </div>
                <p className="text-xs font-medium text-[#1A1A1A] truncate">{n.title}</p>
              </div>

              <div>
                <span
                  className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                  style={
                    n.is_published
                      ? { background: "#42B88320", color: "#42B883" }
                      : { background: "#B07D2A20", color: "#B07D2A" }
                  }
                >
                  {n.is_published ? "Published" : "Draft"}
                </span>
              </div>

              <p className="text-xs text-[#888]">
                {n.scheduled_at
                  ? new Date(n.scheduled_at).toLocaleString("en-GB", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                    })
                  : "—"}
              </p>

              <p className="text-xs text-[#888]">
                {new Date(n.created_at).toLocaleDateString("en-GB", {
                  day: "numeric", month: "short", year: "numeric",
                })}
              </p>

              <div className="flex justify-end items-center gap-2">
                <button
                  onClick={() => navigate(`/newsfeeds/${n.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D8D8D8] hover:bg-[#F0F0F0] transition text-[11px] text-[#555] cursor-pointer"
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="M2.25 12c0 0 3.75-7.5 9.75-7.5s9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                  </svg>
                  View
                </button>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D8D8D8] hover:bg-[#FFF0EE] hover:border-[#D05A3C] transition text-[11px] text-[#D05A3C] cursor-pointer"
                >
                  <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        {!fetching && items.length > 0 && (
          <div className="px-4 py-3 border-t border-[#F0F0F0] flex justify-between items-center bg-[#FAFAFA]">
            <p className="text-[10px] text-[#888]">
              <span className="font-medium text-[#1A1A1A]">{items.length}</span> post{items.length !== 1 ? "s" : ""} total
            </p>
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl border border-[#D8D8D8] overflow-hidden">

            <div className="flex justify-between items-center px-5 py-4 border-b border-[#F0F0F0]">
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A1A]">Create news post</h3>
                <p className="text-[11px] text-[#888]">Will be saved as draft</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#AAA] hover:text-[#555] transition text-sm cursor-pointer"
              >✕</button>
            </div>

            <div className="px-5 py-4 space-y-3">
              <div>
                <label className="text-[11px] uppercase text-[#888] mb-1.5 block">Title</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Enter title…"
                  className="w-full px-3 py-2 text-xs border border-[#D8D8D8] rounded-lg bg-[#F9F9F9] focus:outline-none focus:ring-1 focus:ring-[#42B883] text-[#1A1A1A] placeholder-[#AAA]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase text-[#888] mb-1.5 block">Content</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Enter content…"
                  className="w-full px-3 py-2 text-xs border border-[#D8D8D8] rounded-lg bg-[#F9F9F9] focus:outline-none focus:ring-1 focus:ring-[#42B883] text-[#1A1A1A] placeholder-[#AAA] h-28 resize-none"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase text-[#888] mb-1.5 block">Image URL</label>
                <input
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://…"
                  className="w-full px-3 py-2 text-xs border border-[#D8D8D8] rounded-lg bg-[#F9F9F9] focus:outline-none focus:ring-1 focus:ring-[#42B883] text-[#1A1A1A] placeholder-[#AAA]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase text-[#888] mb-1.5 block">Schedule (optional)</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={e => setScheduledAt(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[#D8D8D8] rounded-lg bg-[#F9F9F9] focus:outline-none focus:ring-1 focus:ring-[#42B883] text-[#1A1A1A]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 px-5 py-4 border-t border-[#F0F0F0]">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-xs border border-[#D8D8D8] rounded-lg text-[#555] hover:bg-[#F0F0F0] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={createNews}
                disabled={loading}
                className="px-4 py-2 text-xs bg-[#42B883] text-white rounded-lg hover:bg-[#2D8A63] transition cursor-pointer disabled:opacity-60"
              >
                {loading ? "Saving…" : "Create post"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}