import { useEffect, useState, useMemo } from "react";
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

const STATUS_OPTIONS = ["all", "open", "in_progress", "closed"] as const;

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  open:        { bg: "#D05A3C20", color: "#D05A3C", label: "Open" },
  in_progress: { bg: "#B07D2A20", color: "#B07D2A", label: "In Progress" },
  closed:      { bg: "#42B88320", color: "#42B883", label: "Closed" },
};

export default function Tickets() {
  const [items, setItems] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/tickets`,
        { withCredentials: true }
      );
      setItems(res.data);
    } catch {
      toast.error("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: number, status: string) {
    setUpdatingId(id);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/tickets/${id}/status`,
        { status },
        { withCredentials: true }
      );
      toast.success("Status updated");
      setItems(prev => prev.map(t => t.id === id ? { ...t, status: status as Ticket["status"] } : t));
    } catch {
      toast.error("Update failed");
    } finally {
      setUpdatingId(null);
    }
  }

  const now = new Date();
  const monthLabel = now.toLocaleString("en-GB", { month: "long", year: "numeric" });

  const openCount = useMemo(() => items.filter(t => t.status === "open").length, [items]);
  const inProgressCount = useMemo(() => items.filter(t => t.status === "in_progress").length, [items]);
  const closedCount = useMemo(() => items.filter(t => t.status === "closed").length, [items]);

  const filtered = useMemo(() => {
    let result = [...items];
    if (statusFilter !== "all") result = result.filter(t => t.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        String(t.id).includes(q) ||
        String(t.user_id).includes(q)
      );
    }
    return result;
  }, [items, statusFilter, search]);

  return (
    <div className="p-6 bg-[#EAEAEA] min-h-screen">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1A1A]">Tickets</h1>
          <p className="text-xs text-[#888]">
            {monthLabel} · Manage user support requests
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Total tickets</p>
          <p className="text-2xl font-semibold text-[#1A1A1A]">{items.length}</p>
        </div>
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Open</p>
          <p className="text-2xl font-semibold text-[#D05A3C]">{openCount}</p>
        </div>
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">In progress</p>
          <p className="text-2xl font-semibold text-[#B07D2A]">{inProgressCount}</p>
        </div>
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Closed</p>
          <p className="text-2xl font-semibold text-[#42B883]">{closedCount}</p>
        </div>
      </div>

      <div className="bg-white border border-[#D8D8D8] rounded-xl p-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">

          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#AAA]"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by title, ticket ID, user ID…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-8 py-2 text-xs border border-[#D8D8D8] rounded-lg bg-[#F9F9F9] focus:outline-none focus:ring-1 focus:ring-[#42B883] text-[#1A1A1A] placeholder-[#AAA]"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAA] hover:text-[#555] text-xs cursor-pointer">✕</button>
            )}
          </div>

          <div className="flex gap-1">
            {STATUS_OPTIONS.map(s => {
              const style = s !== "all" ? statusStyle[s] : null;
              const isActive = statusFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className="px-3 py-1.5 rounded-lg text-[11px] font-medium capitalize transition cursor-pointer"
                  style={
                    isActive && style
                      ? { background: style.color, color: "#fff" }
                      : isActive
                      ? { background: "#42B883", color: "#fff" }
                      : {}
                  }
                  {...(!isActive && { className: "px-3 py-1.5 rounded-lg text-[11px] font-medium capitalize transition cursor-pointer bg-[#F0F0F0] text-[#555] hover:bg-[#E8E8E8]" })}
                >
                  {s === "all" ? "All" : statusStyle[s].label}
                </button>
              );
            })}
          </div>

          <p className="text-[11px] text-[#888]">
            <span className="font-medium text-[#1A1A1A]">{filtered.length}</span> result{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <div className="bg-white border border-[#D8D8D8] rounded-xl overflow-hidden">

        <div className="grid grid-cols-[0.5fr_2fr_1fr_1fr_auto] px-4 py-3 bg-[#F9F9F9] border-b border-[#E8E8E8]">
          {["ID", "Title", "Status", "Created"].map(label => (
            <span key={label} className="text-[11px] uppercase text-[#888]">{label}</span>
          ))}
          <span className="text-[11px] uppercase text-[#888] text-right">Actions</span>
        </div>

        {loading ? (
          <div className="text-center text-[#888] py-16 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-[#888] py-16 text-sm">No tickets found.</div>
        ) : (
          filtered.map(t => {
            const style = statusStyle[t.status];
            return (
              <div
                key={t.id}
                className="grid grid-cols-[0.5fr_2fr_1fr_1fr_auto] px-4 py-3 border-t border-[#F0F0F0] items-center hover:bg-[#F9F9F9] transition"
              >
                <p className="text-[11px] text-[#888] font-mono">#{t.id}</p>

                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                    style={{ background: style.bg, color: style.color }}
                  >
                    {t.title.slice(0, 2).toUpperCase()}
                  </div>
                  <p className="text-xs font-medium text-[#1A1A1A] truncate">{t.title}</p>
                </div>

                <div>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: style.bg, color: style.color }}
                  >
                    {style.label}
                  </span>
                </div>

                <p className="text-xs text-[#888]">
                  {new Date(t.created_at).toLocaleDateString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </p>

                <div className="flex justify-end items-center gap-2">
                  <button
                    onClick={() => navigate(`/tickets/${t.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D8D8D8] hover:bg-[#F0F0F0] transition text-[11px] text-[#555] cursor-pointer"
                  >
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M2.25 12c0 0 3.75-7.5 9.75-7.5s9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    </svg>
                    View
                  </button>

                  <div className="flex gap-1">
                    {(["open", "in_progress", "closed"] as const).filter(s => s !== t.status).map(s => (
                      <button
                        key={s}
                        onClick={() => updateStatus(t.id, s)}
                        disabled={updatingId === t.id}
                        className="px-2.5 py-1.5 rounded-lg border border-[#D8D8D8] text-[10px] font-medium transition cursor-pointer hover:opacity-80 disabled:opacity-40"
                        style={{ background: statusStyle[s].bg, color: statusStyle[s].color }}
                      >
                        {statusStyle[s].label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        )}

        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-[#F0F0F0] flex justify-between items-center bg-[#FAFAFA]">
            <p className="text-[10px] text-[#888]">
              Showing <span className="font-medium text-[#1A1A1A]">{filtered.length}</span> of{" "}
              <span className="font-medium text-[#1A1A1A]">{items.length}</span> tickets
            </p>
            <p className="text-[10px] text-[#888]">
              Open: <span className="font-medium text-[#D05A3C]">{openCount}</span>
              {" · "}In progress: <span className="font-medium text-[#B07D2A]">{inProgressCount}</span>
              {" · "}Closed: <span className="font-medium text-[#42B883]">{closedCount}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}