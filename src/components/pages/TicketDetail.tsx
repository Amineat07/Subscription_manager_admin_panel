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

export default function TicketDetail() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [reply, setReply] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  async function fetchTicket() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/ticket/${id}`,
        { withCredentials: true }
      );
      setTicket(res.data);
    } catch {
      toast.error("Failed to load ticket");
    }
  }

  async function sendReply() {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/tickets/${id}/reply`,
        { message: reply },
        { withCredentials: true }
      );

      toast.success("Reply sent");
      setReply("");
      setOpen(false);
      fetchTicket(); 
    } catch {
      toast.error("Reply failed");
    }
  }

  if (!ticket) return <div className="p-6 text-sm">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-6">

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-[18px] font-semibold text-[#111]">
            Ticket #{ticket.id}
          </h2>
          <p className="text-[12px] text-[#999]">
            User ID: {ticket.user_id} • Created{" "}
            {new Date(ticket.created_at).toLocaleString()}
          </p>
        </div>

        <span className="text-[11px] px-2 py-1 rounded-full bg-[#E6F7F1] text-[#2D8A63]">
          {ticket.status}
        </span>
      </div>

      <div className="bg-white border rounded-xl p-4">
        <p className="text-[14px] font-medium text-[#111] mb-2">
          {ticket.title}
        </p>

        <p className="text-[13px] text-[#444]">
          {ticket.message}
        </p>

        <div className="text-[11px] text-[#999] mt-3">
          Asked at {new Date(ticket.created_at).toLocaleString()}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-[13px] font-medium text-[#111]">
          Conversation
        </h3>

        {ticket.replies?.length === 0 && (
          <p className="text-[12px] text-[#999]">
            No replies yet
          </p>
        )}

        {ticket.replies?.map((r) => (
          <div
            key={r.id}
            className={`p-3 rounded-xl max-w-[80%] ${
              r.role === "admin"
                ? "ml-auto bg-[#2D8A63] text-white"
                : "bg-[#F5F5F5] text-[#111]"
            }`}
          >
            <p className="text-[13px]">{r.message}</p>

            <div className="text-[10px] mt-2 opacity-70">
              {r.created_by} • {new Date(r.created_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => setOpen(true)}
        className="px-3 py-2 bg-[#2D8A63] text-white text-[12px] rounded-lg hover:bg-[#256F52]"
      >
        Reply
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white w-full max-w-md p-5 rounded-xl space-y-3">

            <h3 className="font-medium">Send Reply</h3>

            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              className="w-full border rounded-lg p-2 h-24 text-[13px]"
              placeholder="Type your reply..."
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="text-[12px] border px-3 py-1 rounded"
              >
                Cancel
              </button>

              <button
                onClick={sendReply}
                className="text-[12px] bg-[#2D8A63] text-white px-3 py-1 rounded"
              >
                Send
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}