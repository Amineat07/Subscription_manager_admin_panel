import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "../../utils/Toast";

type Stats = {
  users: number;
  subscriptions: number;
  tickets: {
    open: number;
    in_progress: number;
    closed: number;
  };
  newsfeed: number;
};

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/api/v1/dashboard/stats`,
        { withCredentials: true }
      );
      setStats(res.data);
    } catch (err) {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  const now = new Date();
  const monthLabel = now.toLocaleString("en-GB", { month: "long", year: "numeric" });

  const totalTickets =
    (stats?.tickets?.open ?? 0) +
    (stats?.tickets?.in_progress ?? 0) +
    (stats?.tickets?.closed ?? 0);

  const openPct = totalTickets ? Math.round(((stats?.tickets?.open ?? 0) / totalTickets) * 100) : 0;
  const inProgressPct = totalTickets ? Math.round(((stats?.tickets?.in_progress ?? 0) / totalTickets) * 100) : 0;
  const closedPct = totalTickets ? Math.round(((stats?.tickets?.closed ?? 0) / totalTickets) * 100) : 0;

  return (
    <div className="p-6 bg-[#EAEAEA] min-h-screen">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1A1A]">Admin Dashboard</h1>
          <p className="text-xs text-[#888]">
            {monthLabel} · Platform overview
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="cursor-pointer px-4 py-2 bg-[#42B883] text-white rounded-lg hover:bg-[#2D8A63] transition text-sm"
        >
          Refresh stats
        </button>
      </div>

      {loading ? (
        <div className="text-center text-[#888] py-20 text-sm">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <StatCard label="Total users" value={stats?.users ?? 0} />
            <StatCard label="Subscriptions" value={stats?.subscriptions ?? 0} />
            <StatCard label="Newsfeed posts" value={stats?.newsfeed ?? 0} />
            <StatCard label="Open tickets" value={stats?.tickets?.open ?? 0} danger />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">

            <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
              <div className="flex justify-between items-center mb-3">
                <p className="text-[11px] uppercase text-[#888]">Ticket overview</p>
                <p className="text-xs font-medium text-[#888]">{totalTickets} total</p>
              </div>

              <div className="w-full flex rounded-full h-2 overflow-hidden mb-4 gap-0.5">
                {openPct > 0 && (
                  <div className="h-2 transition-all duration-500 rounded-l-full" style={{ width: `${openPct}%`, background: "#D05A3C" }} />
                )}
                {inProgressPct > 0 && (
                  <div className="h-2 transition-all duration-500" style={{ width: `${inProgressPct}%`, background: "#B07D2A" }} />
                )}
                {closedPct > 0 && (
                  <div className="h-2 transition-all duration-500 rounded-r-full" style={{ width: `${closedPct}%`, background: "#42B883" }} />
                )}
              </div>

              <div className="space-y-2">
                <TicketRow
                  label="Open"
                  value={stats?.tickets?.open ?? 0}
                  pct={openPct}
                  color="#D05A3C"
                />
                <TicketRow
                  label="In Progress"
                  value={stats?.tickets?.in_progress ?? 0}
                  pct={inProgressPct}
                  color="#B07D2A"
                />
                <TicketRow
                  label="Closed"
                  value={stats?.tickets?.closed ?? 0}
                  pct={closedPct}
                  color="#42B883"
                />
              </div>
            </div>

            <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
              <p className="text-[11px] uppercase text-[#888] mb-3">Platform health</p>

              <div className="space-y-3">
                <HealthRow
                  label="Ticket resolution rate"
                  value={totalTickets ? closedPct : 0}
                  color={closedPct >= 70 ? "#42B883" : closedPct >= 40 ? "#B07D2A" : "#D05A3C"}
                  suffix="%"
                />
                <HealthRow
                  label="Active subscriptions"
                  value={stats?.subscriptions ?? 0}
                  color="#42B883"
                  suffix=""
                />
                <HealthRow
                  label="Registered users"
                  value={stats?.users ?? 0}
                  color="#42B883"
                  suffix=""
                />
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0F0F0]">
                <p className="text-[11px] uppercase text-[#888] mb-2">Subscriptions per user</p>
                <p className="text-2xl font-semibold text-[#1A1A1A]">
                  {stats?.users
                    ? ((stats.subscriptions ?? 0) / stats.users).toFixed(2)
                    : "—"}
                </p>
              </div>
            </div>

          </div>

          
          <div className="grid grid-cols-2 gap-3">

            <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
              <p className="text-[11px] uppercase text-[#888] mb-3">Content overview</p>

              <div className="space-y-2">
                {[
                  { label: "Newsfeed posts", value: stats?.newsfeed ?? 0, color: "#42B883" },
                  { label: "Total users", value: stats?.users ?? 0, color: "#42B883" },
                  { label: "Total subscriptions", value: stats?.subscriptions ?? 0, color: "#42B883" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-[#F9F9F9] transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0"
                        style={{ background: item.color + "20", color: item.color }}
                      >
                        {item.label.slice(0, 2).toUpperCase()}
                      </div>
                      <p className="text-xs font-medium text-[#1A1A1A]">{item.label}</p>
                    </div>
                    <p className="text-xs font-semibold text-[#1A1A1A]">{item.value.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
              <p className="text-[11px] uppercase text-[#888] mb-3">Ticket status summary</p>

              {totalTickets === 0 ? (
                <div className="text-xs text-[#888] py-4 text-center">No tickets found.</div>
              ) : (
                <div className="space-y-2">
                  {[
                    { label: "Open", value: stats?.tickets?.open ?? 0, color: "#D05A3C", desc: "Needs attention" },
                    { label: "In Progress", value: stats?.tickets?.in_progress ?? 0, color: "#B07D2A", desc: "Being handled" },
                    { label: "Closed", value: stats?.tickets?.closed ?? 0, color: "#42B883", desc: "Resolved" },
                  ].map((t) => (
                    <div
                      key={t.label}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-[#D8D8D8] hover:bg-[#F9F9F9] transition"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: t.color }} />
                        <div>
                          <p className="text-xs font-medium text-[#1A1A1A]">{t.label}</p>
                          <p className="text-[10px] text-[#888]">{t.desc}</p>
                        </div>
                      </div>
                      <p className="text-xs font-semibold text-[#1A1A1A]">{t.value}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-3 pt-3 border-t border-[#F0F0F0]">
                <p className="text-[10px] text-[#888]">
                  Live data · Last refreshed{" "}
                  <span className="text-[#1A1A1A] font-medium">
                    {new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </p>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}


function StatCard({
  label,
  value,
  danger,
}: {
  label: string;
  value: number;
  danger?: boolean;
}) {
  return (
    <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
      <p className="text-[11px] uppercase text-[#888] mb-1">{label}</p>
      <p className="text-2xl font-semibold text-[#1A1A1A]">{value.toLocaleString()}</p>
      <p className={`text-[11px] mt-1 ${danger ? "text-[#D05A3C]" : "text-[#42B883]"}`}>
        live data
      </p>
    </div>
  );
}

function TicketRow({
  label,
  value,
  pct,
  color,
}: {
  label: string;
  value: number;
  pct: number;
  color: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
        <p className="text-xs text-[#555]">{label}</p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-[10px] text-[#888]">{pct}%</p>
        <p className="text-xs font-medium text-[#1A1A1A] w-6 text-right">{value}</p>
      </div>
    </div>
  );
}

function HealthRow({
  label,
  value,
  color,
  suffix,
}: {
  label: string;
  value: number;
  color: string;
  suffix: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-xs text-[#555]">{label}</p>
      <p className="text-sm font-semibold" style={{ color }}>
        {value.toLocaleString()}{suffix}
      </p>
    </div>
  );
}