import { useState } from "react";
import axios from "axios";
import { toast } from "../../utils/Toast";
import { useNavigate } from "react-router-dom";

export default function CreateNewsFeed() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        { withCredentials: true }
      );

      toast.success("News created successfully");
      navigate("/newsfeed");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to create news");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      <div>
        <button
          onClick={() => navigate(-1)}
          className="text-[12px] text-[#2D8A63] hover:underline"
        >
          ← Back
        </button>

        <h2 className="text-[20px] font-medium text-[#111] mt-2">
          Create News Feed
        </h2>
        <p className="text-[12px] text-[#888]">
          Publish updates to your platform users
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#EDEDED] rounded-2xl p-6 space-y-5 shadow-sm"
      >

        <div>
          <label className="text-[12px] text-[#666]">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mt-1 px-3 py-2 text-[13px] border rounded-lg focus:outline-none focus:border-[#2D8A63]"
            placeholder="Enter news title"
            required
          />
        </div>

        <div>
          <label className="text-[12px] text-[#666]">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full mt-1 px-3 py-2 text-[13px] border rounded-lg h-32 resize-none focus:outline-none focus:border-[#2D8A63]"
            placeholder="Write your announcement..."
            required
          />
        </div>

        <div>
          <label className="text-[12px] text-[#666]">Image URL (optional)</label>
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full mt-1 px-3 py-2 text-[13px] border rounded-lg focus:outline-none focus:border-[#2D8A63]"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="text-[12px] text-[#666]">Schedule (optional)</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            className="w-full mt-1 px-3 py-2 text-[13px] border rounded-lg focus:outline-none focus:border-[#2D8A63]"
          />
          <p className="text-[11px] text-[#999] mt-1">
            Leave empty to publish immediately
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-2">

          <button
            type="button"
            onClick={() => navigate("/newsfeed")}
            className="px-4 py-2 text-[12px] rounded-lg border hover:bg-[#FAFAFA]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-[12px] rounded-lg bg-[#2D8A63] text-white hover:bg-[#256F52] transition"
          >
            {loading ? "Publishing..." : "Create News"}
          </button>

        </div>

      </form>
    </div>
  );
}