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

  if (loading) {
    return <div className="text-sm text-[#999]">Loading...</div>;
  }

  if (!data) {
    return <div className="text-sm text-red-500">Not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <button
        onClick={() => navigate(-1)}
        className="text-[12px] text-[#2D8A63] hover:underline"
      >
        ← Back
      </button>

      <div className="bg-white border border-[#EBEBEB] rounded-xl p-6 space-y-4">

        <h1 className="text-[20px] font-medium text-[#111]">
          {data.title}
        </h1>

        <div className="flex gap-2 items-center text-[11px] text-[#888]">
          <span
            className={`px-2 py-1 rounded-full ${
              data.is_published
                ? "bg-[#E6F7F1] text-[#2D8A63]"
                : "bg-[#FFF4E5] text-[#B45309]"
            }`}
          >
            {data.is_published ? "Published" : "Draft"}
          </span>

          <span>
            Created: {new Date(data.created_at).toLocaleDateString()}
          </span>

          {data.scheduled_at && (
            <span>
              Scheduled: {new Date(data.scheduled_at).toLocaleString()}
            </span>
          )}
        </div>

        {data.image_url && (
          <img
            src={data.image_url}
            className="w-full rounded-lg border"
          />
        )}

        <p className="text-[13px] text-[#444] whitespace-pre-line leading-relaxed">
          {data.content}
        </p>

      </div>
    </div>
  );
}