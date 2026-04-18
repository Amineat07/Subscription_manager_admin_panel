import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "../../utils/Toast";

type TicketReply = {
  id: number;
  message: string;
  created_by: string;
  role: "admin" | "user";
  created_at: string;
};

type Ticket = {
  id: number;
  user_id: number;
  title: string;
  message: string;
  status: string;
  created_at: string;
  replies: TicketReply[];
};

const statusStyle = (status: string) => {
  switch (status) {
    case "open":
      return { background: "#D05A3C20", color: "#D05A3C" };
    case "in_progress":
      return { background: "#B07D2A20", color: "#B07D2A" };
    case "closed":
      return { background: "#42B88320", color: "#42B883" };
    default:
      return { background: "#88888820", color: "#888" };
  }
};

export default function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  async function fetchTicket() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/ticket/${id}`,
        { withCredentials: true },
      );
      setTicket(res.data);
    } catch {
      toast.error("Failed to load ticket");
    }
  }

  async function sendReply() {
    if (!reply.trim()) return;
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/tickets/${id}/reply`,
        { message: reply },
        { withCredentials: true },
      );
      toast.success("Reply sent");
      setReply("");
      setOpen(false);
      fetchTicket();
    } catch {
      toast.error("Reply failed");
    } finally {
      setLoading(false);
    }
  }

  if (!ticket)
    return (
      <div className="p-6 bg-[#EAEAEA] min-h-screen flex items-center justify-center">
        <p className="text-sm text-[#888]">Loading...</p>
      </div>
    );

  return (
    <div className="p-6 bg-[#EAEAEA] min-h-screen">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-xl font-semibold text-[#1A1A1A]">
              Ticket #{ticket.id}
            </h1>
            <p className="text-xs text-[#888] mt-0.5">
              User ID: {ticket.user_id} · Created{" "}
              {new Date(ticket.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
            style={statusStyle(ticket.status)}
          >
            {ticket.status.replace("_", " ")}
          </span>
        </div>

        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
              style={{ background: "#42B88320", color: "#42B883" }}
            >
              {ticket.title.slice(0, 2).toUpperCase()}
            </div>
            <p className="text-xs font-medium text-[#1A1A1A]">{ticket.title}</p>
          </div>
          <p className="text-xs text-[#444] leading-relaxed">
            {ticket.message}
          </p>
          <p className="text-[10px] text-[#888] mt-3 pt-3 border-t border-[#F0F0F0]">
            Asked at{" "}
            {new Date(ticket.created_at).toLocaleString("en-GB", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="bg-white border border-[#D8D8D8] rounded-xl overflow-hidden">
          <div className="px-4 py-3 bg-[#F9F9F9] border-b border-[#E8E8E8]">
            <span className="text-[11px] uppercase text-[#888]">
              Conversation
            </span>
            <span className="ml-2 text-[10px] text-[#AAA]">
              {ticket.replies?.length ?? 0}{" "}
              {ticket.replies?.length === 1 ? "reply" : "replies"}
            </span>
          </div>

          <div className="p-4 space-y-3">
            {!ticket.replies || ticket.replies.length === 0 ? (
              <p className="text-xs text-[#888] text-center py-6">
                No replies yet.
              </p>
            ) : (
              ticket.replies.map((r) => (
                <div
                  key={r.id}
                  className={`flex ${r.role === "admin" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className="max-w-[75%] px-3 py-2.5 rounded-xl"
                    style={
                      r.role === "admin"
                        ? { background: "#42B883", color: "#fff" }
                        : {
                            background: "#F5F5F3",
                            color: "#1A1A1A",
                            border: "0.5px solid #E8E8E8",
                          }
                    }
                  >
                    <p className="text-xs leading-relaxed">{r.message}</p>
                    <p className="text-[10px] mt-1.5 opacity-70">
                      {r.created_by} ·{" "}
                      {new Date(r.created_at).toLocaleString("en-GB", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-3 border-t border-[#F0F0F0] flex justify-end">
            <button
              onClick={() => setOpen(true)}
              className="cursor-pointer px-4 py-2 bg-[#42B883] text-white rounded-lg hover:bg-[#2D8A63] transition text-sm"
            >
              + Reply
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl border border-[#D8D8D8] overflow-hidden">
            <div className="flex justify-between items-center px-5 py-4 border-b border-[#F0F0F0]">
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A1A]">
                  Send reply
                </h3>
                <p className="text-[11px] text-[#888]">Ticket #{ticket.id}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-[#AAA] hover:text-[#555] transition text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="px-5 py-4">
              <label className="text-[11px] uppercase text-[#888] mb-1.5 block">
                Message
              </label>
              <textarea
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply…"
                className="w-full px-3 py-2 text-xs border border-[#D8D8D8] rounded-lg bg-[#F9F9F9] focus:outline-none focus:ring-1 focus:ring-[#42B883] text-[#1A1A1A] placeholder-[#AAA] h-28 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 px-5 py-4 border-t border-[#F0F0F0]">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-xs border border-[#D8D8D8] rounded-lg text-[#555] hover:bg-[#F0F0F0] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={sendReply}
                disabled={loading || !reply.trim()}
                className="px-4 py-2 text-xs bg-[#42B883] text-white rounded-lg hover:bg-[#2D8A63] transition cursor-pointer disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send reply"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
