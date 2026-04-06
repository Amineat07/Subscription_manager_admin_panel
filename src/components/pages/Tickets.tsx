import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "../../utils/Toast";

type Ticket = {
  id: number;
  user_id: number;
  title: string;
  status: "open" | "in_progress" | "closed";
  created_at: string;
};

export default function Tickets() {
  const [items, setItems] = useState<Ticket[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/api/v1/tickets`,
        { withCredentials: true }
      );
      setItems(res.data);
    } catch {
      toast.error("Failed to load tickets");
    }
  }

  async function updateStatus(id: number, status: string) {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/admin/api/v1/tickets/${id}/status`,
        { status },
        { withCredentials: true }
      );

      toast.success("Status updated");
      fetchTickets();
    } catch {
      toast.error("Update failed");
    }
  }

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-[18px] font-medium text-[#111]">Tickets</h2>
        <p className="text-[12px] text-[#999]">
          Manage user support requests
        </p>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">

        <div className="grid grid-cols-5 px-4 py-3 text-[11px] text-[#999] bg-[#FAFAFA]">
          <span>ID</span>
          <span>Title</span>
          <span>Status</span>
          <span>Date</span>
          <span className="text-right">Actions</span>
        </div>

        {items.map((t) => (
          <div
            key={t.id}
            className="grid grid-cols-5 px-4 py-3 border-t items-center hover:bg-[#FAFAFA]"
          >

            <div className="text-[12px] text-[#555]">#{t.id}</div>

            <div className="text-[13px] font-medium truncate">
              {t.title}
            </div>

            <div>
              <span
                className={`text-[11px] px-2 py-1 rounded-full ${
                  t.status === "open"
                    ? "bg-[#FFF4E5] text-[#B45309]"
                    : t.status === "in_progress"
                    ? "bg-[#E6F0FF] text-[#2563EB]"
                    : "bg-[#E6F7F1] text-[#2D8A63]"
                }`}
              >
                {t.status}
              </span>
            </div>

            <div className="text-[12px] text-[#999]">
              {new Date(t.created_at).toLocaleDateString()}
            </div>

            <div className="flex justify-end gap-2">

              <button
                onClick={() => navigate(`/tickets/${t.id}`)}
                className="text-[12px] text-[#2D8A63] hover:underline"
              >
                View
              </button>

              <select
                onChange={(e) => updateStatus(t.id, e.target.value)}
                className="text-[11px] border rounded px-1 py-0.5"
                value={t.status}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="closed">Closed</option>
              </select>

            </div>

          </div>
        ))}
      </div>
    </div>
  );
}