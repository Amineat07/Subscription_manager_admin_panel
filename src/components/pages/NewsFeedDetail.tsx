import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "../../utils/Toast";

type NewsFeed = {
  id: number;
  title: string;
  content: string;
  image_url?: string;
  is_published: boolean;
  scheduled_at?: string;
  published_at?: string;
  created_at: string;
  created_by?: number;
};

export default function NewsFeedDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState<NewsFeed | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  async function fetchDetail() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/api/v1/newsfeed/${id}`,
        { withCredentials: true }
      );
      setData(res.data);
    } catch {
      toast.error("Failed to load news detail");
    } finally {
      setLoading(false);
    }
  }

  const now = new Date();
  const monthLabel = now.toLocaleString("en-GB", { month: "long", year: "numeric" });

  function formatDate(d?: string) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
    });
  }

  function formatDateTime(d?: string) {
    if (!d) return "—";
    return new Date(d).toLocaleString("en-GB", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="p-6 bg-[#EAEAEA] min-h-screen">
        <div className="text-center text-[#888] py-20 text-sm">Loading...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6 bg-[#EAEAEA] min-h-screen">
        <div className="text-center text-[#D05A3C] py-20 text-sm">News post not found.</div>
      </div>
    );
  }

  const statusColor = data.is_published ? "#42B883" : "#B07D2A";
  const initials = data.title.slice(0, 2).toUpperCase();

  return (
    <div className="p-6 bg-[#EAEAEA] min-h-screen">

      <div className="flex justify-between items-center mb-6">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs text-[#888] hover:text-[#1A1A1A] transition mb-1 cursor-pointer"
          >
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Back to news feed
          </button>
          <h1 className="text-xl font-semibold text-[#1A1A1A]">{data.title}</h1>
          <p className="text-xs text-[#888]">{monthLabel} · News post detail</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Status</p>
          <p className="text-base font-semibold capitalize" style={{ color: statusColor }}>
            {data.is_published ? "Published" : "Draft"}
          </p>
        </div>
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Created</p>
          <p className="text-base font-semibold text-[#1A1A1A]">{formatDate(data.created_at)}</p>
        </div>
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Scheduled</p>
          <p className="text-base font-semibold text-[#1A1A1A]">
            {data.scheduled_at ? formatDate(data.scheduled_at) : "—"}
          </p>
        </div>
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Post ID</p>
          <p className="text-2xl font-semibold text-[#1A1A1A]">#{data.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">

        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-3">Post identity</p>

          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-semibold flex-shrink-0"
              style={{ background: statusColor + "20", color: statusColor }}
            >
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">{data.title}</p>
              <span
                className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium"
                style={{ background: statusColor + "20", color: statusColor }}
              >
                {data.is_published ? "Published" : "Draft"}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#F0F0F0]">
            {[
              { label: "Created", value: formatDateTime(data.created_at) },
              { label: "Published at", value: formatDateTime(data.published_at) },
              { label: "Scheduled at", value: formatDateTime(data.scheduled_at) },
              { label: "Created by (ID)", value: data.created_by ? `#${data.created_by}` : "—" },
            ].map(row => (
              <div key={row.label} className="flex justify-between items-center">
                <p className="text-[11px] text-[#888]">{row.label}</p>
                <p className="text-xs font-medium text-[#1A1A1A]">{row.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-3">Image</p>
          {data.image_url ? (
            <>
              <img
                src={data.image_url}
                alt={data.title}
                className="w-full rounded-lg border border-[#E8E8E8] object-cover max-h-48"
              />
              <p className="text-[10px] text-[#AAA] mt-2 truncate">{data.image_url}</p>
            </>
          ) : (
            <div className="w-full h-32 rounded-lg border border-dashed border-[#D8D8D8] flex items-center justify-center">
              <p className="text-xs text-[#AAA]">No image attached</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
        <p className="text-[11px] uppercase text-[#888] mb-3">Content</p>
        <p className="text-xs text-[#444] whitespace-pre-line leading-relaxed">
          {data.content}
        </p>
      </div>

    </div>
  );
}