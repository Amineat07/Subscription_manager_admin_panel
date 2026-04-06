import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "../../utils/Toast";
import { useNavigate } from "react-router-dom";
import type { NewsFeed } from "../Models/NewsFeed";



export default function NewsFeed() {
  const [items, setItems] = useState<NewsFeed[]>([]);
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews();

    const interval = setInterval(() => {
      fetchNews();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  async function fetchNews() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/api/v1/newsfeed`,
        { withCredentials: true },
      );
      setItems(res.data);
    } catch {
      toast.error("Failed to load news feed");
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
        `${import.meta.env.VITE_API_URL}/admin/api/v1/newsfeed`,
        {
          title,
          content,
          image_url: imageUrl || "",
          scheduled_at: scheduledAt ? new Date(scheduledAt) : null,
          is_published: false,
        },
        { withCredentials: true },
      );

      toast.success("News created");

      setOpen(false);
      setTitle("");
      setContent("");
      setImageUrl("");
      setScheduledAt("");

      fetchNews();
    } catch {
      toast.error("Create failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    const confirm = await toast.danger("Delete news?", "");
    if (!confirm.isConfirmed) return;

    await axios.delete(`${import.meta.env.VITE_API_URL}/admin/api/v1/newsfeed/${id}`, {
      withCredentials: true,
    });

    setItems((prev) => prev.filter((n) => n.id !== id));
    toast.success("Deleted");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-medium text-[#111]">News Feed</h2>
          <p className="text-[12px] text-[#999]">
            Manage platform announcements
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="px-3 py-2 text-[12px] rounded-lg bg-[#2D8A63] text-white hover:bg-[#256F52]"
        >
          + Create News
        </button>
      </div>

      <div className="bg-white border border-[#EBEBEB] rounded-[12px] overflow-hidden">
        <div className="grid grid-cols-5 px-4 py-3 text-[11px] text-[#999] bg-[#FAFAFA]">
          <span>Title</span>
          <span>Status</span>
          <span>Scheduled</span>
          <span>Created</span>
          <span className="text-right">Actions</span>
        </div>

        {items.map((n) => (
          <div
            key={n.id}
            className="grid grid-cols-5 px-4 py-3 border-t items-center hover:bg-[#FAFAFA]"
          >
            <div className="text-[13px] font-medium text-[#111] truncate">
              {n.title}
            </div>

            <div>
              {n.is_published ? (
                <span className="text-[11px] px-2 py-1 rounded-full bg-[#E6F7F1] text-[#2D8A63]">
                  Published
                </span>
              ) : (
                <span className="text-[11px] px-2 py-1 rounded-full bg-[#FFF4E5] text-[#B45309]">
                  Draft
                </span>
              )}
            </div>

            <div className="text-[12px] text-[#777]">
              {n.scheduled_at ? new Date(n.scheduled_at).toLocaleString() : "-"}
            </div>

            <div className="text-[12px] text-[#999]">
              {new Date(n.created_at).toLocaleDateString()}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => navigate(`/newsfeeds/${n.id}`)}
                className="text-[12px] text-[#2D8A63] hover:underline"
              >
                View
              </button>
              <button
                className="text-[12px] text-red-500"
                onClick={() => handleDelete(n.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-[16px] font-medium text-[#111]">
                Create News
              </h3>

              <button
                onClick={() => setOpen(false)}
                className="text-[#999] hover:text-black"
              >
                ✕
              </button>
            </div>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full px-3 py-2 text-[13px] border rounded-lg focus:border-[#2D8A63] outline-none"
            />

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Content"
              className="w-full px-3 py-2 text-[13px] border rounded-lg h-28 focus:border-[#2D8A63] outline-none"
            />

            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL"
              className="w-full px-3 py-2 text-[13px] border rounded-lg focus:border-[#2D8A63] outline-none"
            />

            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="w-full px-3 py-2 text-[13px] border rounded-lg focus:border-[#2D8A63] outline-none"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 text-[12px] border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={createNews}
                disabled={loading}
                className="px-3 py-1.5 text-[12px] bg-[#2D8A63] text-white rounded-lg hover:bg-[#256F52]"
              >
                {loading ? "Saving..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
