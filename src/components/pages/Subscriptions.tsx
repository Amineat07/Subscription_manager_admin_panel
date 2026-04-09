import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { Subscription } from "../Models/Subscription";
import { toast } from "../../utils/Toast";

const BILLING_PERIODS = ["all", "monthly", "yearly", "quarterly", "weekly"] as const;

export default function Subscriptions() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [userIdFilter, setUserIdFilter] = useState("");
  const [billingFilter, setBillingFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "company">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const navigate = useNavigate();

  useEffect(() => {
    const loadSubs = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/api/v1/subscriptions`,
          { withCredentials: true }
        );
        setSubs(res.data);
      } catch (err) {
        toast.error("Failed to load subscriptions");
      } finally {
        setLoading(false);
      }
    };
    loadSubs();
  }, []);

  const now = new Date();
  const monthLabel = now.toLocaleString("en-GB", { month: "long", year: "numeric" });

  const totalMonthly = useMemo(() =>
    subs.filter(s => s.billing_period === "monthly").reduce((sum, s) => sum + Number(s.price || 0), 0),
    [subs]
  );
  const uniqueCompanies = useMemo(() =>
    new Set(subs.map(s => s.company?.company_name).filter(Boolean)).size,
    [subs]
  );
  const avgPrice = useMemo(() =>
    subs.length ? subs.reduce((sum, s) => sum + Number(s.price || 0), 0) / subs.length : 0,
    [subs]
  );

  const filtered = useMemo(() => {
    let result = [...subs];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.subscription_name?.toLowerCase().includes(q) ||
        s.company?.company_name?.toLowerCase().includes(q) ||
        s.typ?.toLowerCase().includes(q)
      );
    }

    if (emailFilter.trim()) {
      const q = emailFilter.toLowerCase();
      result = result.filter(s => s.user_email?.toLowerCase().includes(q));
    }

    if (userIdFilter.trim()) {
      result = result.filter(s =>
        String(s.user_id ?? "").includes(userIdFilter.trim())
      );
    }

    if (billingFilter !== "all") {
      result = result.filter(s => s.billing_period === billingFilter);
    }

    result.sort((a, b) => {
      let valA: string | number = "";
      let valB: string | number = "";
      if (sortBy === "name") { valA = a.subscription_name ?? ""; valB = b.subscription_name ?? ""; }
      if (sortBy === "price") { valA = Number(a.price || 0); valB = Number(b.price || 0); }
      if (sortBy === "company") { valA = a.company?.company_name ?? ""; valB = b.company?.company_name ?? ""; }

      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [subs, search, emailFilter, userIdFilter, billingFilter, sortBy, sortDir]);

  const hasActiveFilters = search || emailFilter || userIdFilter || billingFilter !== "all";

  function clearAllFilters() {
    setSearch("");
    setEmailFilter("");
    setUserIdFilter("");
    setBillingFilter("all");
  }

  function toggleSort(col: "name" | "price" | "company") {
    if (sortBy === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortBy(col); setSortDir("asc"); }
  }

  const periodColors: Record<string, string> = {
    monthly: "#42B883",
    yearly: "#6366F1",
    quarterly: "#B07D2A",
    weekly: "#D05A3C",
  };

  function formatPrice(price: any, period?: string) {
    const labels: Record<string, string> = { weekly: "/wk", monthly: "/mo", quarterly: "/qtr", yearly: "/yr" };
    return `€${(Number(price) || 0).toFixed(2)}${period ? (labels[period] ?? "") : ""}`;
  }

  return (
    <div className="p-6 bg-[#EAEAEA] min-h-screen">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1A1A]">Subscriptions</h1>
          <p className="text-xs text-[#888]">
            {monthLabel} · All user subscriptions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Total subscriptions</p>
          <p className="text-2xl font-semibold text-[#1A1A1A]">{subs.length}</p>
        </div>
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Monthly spend</p>
          <p className="text-2xl font-semibold text-[#1A1A1A]">€{totalMonthly.toFixed(2)}</p>
        </div>
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Unique companies</p>
          <p className="text-2xl font-semibold text-[#1A1A1A]">{uniqueCompanies}</p>
        </div>
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Avg price</p>
          <p className="text-2xl font-semibold text-[#1A1A1A]">€{avgPrice.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white border border-[#D8D8D8] rounded-xl p-4 mb-4 space-y-3">

        <div className="flex gap-3 items-center">

          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#AAA]"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name or company…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-8 py-2 text-xs border border-[#D8D8D8] rounded-lg bg-[#F9F9F9] focus:outline-none focus:ring-1 focus:ring-[#42B883] text-[#1A1A1A] placeholder-[#AAA]"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAA] hover:text-[#555] text-xs cursor-pointer">✕</button>
            )}
          </div>

          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#AAA]"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25m19.5 0-9.75 6.75L2.25 6.75" />
            </svg>
            <input
              type="text"
              placeholder="Filter by email…"
              value={emailFilter}
              onChange={e => setEmailFilter(e.target.value)}
              className="w-full pl-8 pr-8 py-2 text-xs border border-[#D8D8D8] rounded-lg bg-[#F9F9F9] focus:outline-none focus:ring-1 focus:ring-[#42B883] text-[#1A1A1A] placeholder-[#AAA]"
            />
            {emailFilter && (
              <button onClick={() => setEmailFilter("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAA] hover:text-[#555] text-xs cursor-pointer">✕</button>
            )}
          </div>

          <div className="relative w-44">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#AAA]"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0zM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
            <input
              type="text"
              placeholder="Filter by user ID…"
              value={userIdFilter}
              onChange={e => setUserIdFilter(e.target.value)}
              className="w-full pl-8 pr-8 py-2 text-xs border border-[#D8D8D8] rounded-lg bg-[#F9F9F9] focus:outline-none focus:ring-1 focus:ring-[#42B883] text-[#1A1A1A] placeholder-[#AAA]"
            />
            {userIdFilter && (
              <button onClick={() => setUserIdFilter("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#AAA] hover:text-[#555] text-xs cursor-pointer">✕</button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1 flex-wrap">
            {BILLING_PERIODS.map(p => (
              <button
                key={p}
                onClick={() => setBillingFilter(p)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium capitalize transition cursor-pointer ${
                  billingFilter === p
                    ? "bg-[#42B883] text-white"
                    : "bg-[#F0F0F0] text-[#555] hover:bg-[#E8E8E8]"
                }`}
              >
                {p === "all" ? "All periods" : p}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-[#D05A3C] hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            )}
            <p className="text-[11px] text-[#888]">
              <span className="font-medium text-[#1A1A1A]">{filtered.length}</span>{" "}
              result{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#D8D8D8] rounded-xl overflow-hidden">

        <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1.5fr_auto] px-4 py-3 bg-[#F9F9F9] border-b border-[#E8E8E8]">
          {[
            { label: "Name", col: "name" as const },
            { label: "Company", col: "company" as const },
            { label: "Period", col: null },
            { label: "Price", col: "price" as const },
            { label: "User email", col: null },
          ].map(({ label, col }) => (
            <button
              key={label}
              onClick={() => col && toggleSort(col)}
              className={`text-left text-[11px] uppercase text-[#888] flex items-center gap-1 ${col ? "cursor-pointer hover:text-[#1A1A1A]" : "cursor-default"}`}
            >
              {label}
              {col && (
                <span className={`text-[9px] transition ${sortBy === col ? "text-[#42B883]" : "text-[#CCC]"}`}>
                  {sortBy === col ? (sortDir === "asc" ? "▲" : "▼") : "⬍"}
                </span>
              )}
            </button>
          ))}
          <span className="text-[11px] uppercase text-[#888] text-right">Actions</span>
        </div>

        {loading ? (
          <div className="text-center text-[#888] py-16 text-sm">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-[#888] py-16 text-sm">No subscriptions found.</div>
        ) : (
          filtered.map((sub) => {
            const color = periodColors[sub.billing_period] ?? "#42B883";
            const initials = (sub.subscription_name ?? "??").slice(0, 2).toUpperCase();
            return (
              <div
                key={sub.id}
                className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1.5fr_auto] px-4 py-3 border-t border-[#F0F0F0] items-center hover:bg-[#F9F9F9] transition"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-semibold flex-shrink-0"
                    style={{ background: color + "20", color }}
                  >
                    {initials}
                  </div>
                  <p className="text-xs font-medium text-[#1A1A1A] truncate">{sub.subscription_name}</p>
                </div>

                <p className="text-xs text-[#555] truncate">{sub.company?.company_name || "—"}</p>

                <div>
                  {sub.billing_period ? (
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium capitalize"
                      style={{ background: color + "20", color }}
                    >
                      {sub.billing_period}
                    </span>
                  ) : (
                    <span className="text-[10px] text-[#888]">—</span>
                  )}
                </div>

                <p className="text-xs font-semibold text-[#1A1A1A]">
                  {formatPrice(sub.price, sub.billing_period)}
                </p>

                <p className="text-xs text-[#888] truncate">{sub.user_email || "—"}</p>

                <div className="flex justify-end">
                  <button
                    onClick={() => navigate(`/subscriptions/${sub.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D8D8D8] hover:bg-[#F0F0F0] transition text-[11px] text-[#555] cursor-pointer"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                      strokeWidth={1.8} stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M2.25 12c0 0 3.75-7.5 9.75-7.5s9.75 7.5 9.75 7.5-3.75 7.5-9.75 7.5S2.25 12 2.25 12z" />
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                    </svg>
                    View
                  </button>
                </div>
              </div>
            );
          })
        )}

        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-[#F0F0F0] flex justify-between items-center bg-[#FAFAFA]">
            <p className="text-[10px] text-[#888]">
              Showing <span className="font-medium text-[#1A1A1A]">{filtered.length}</span> of{" "}
              <span className="font-medium text-[#1A1A1A]">{subs.length}</span> subscriptions
            </p>
            <p className="text-[10px] text-[#888]">
              Filtered total:{" "}
              <span className="font-medium text-[#1A1A1A]">
                €{filtered.reduce((sum, s) => sum + Number(s.price || 0), 0).toFixed(2)}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}