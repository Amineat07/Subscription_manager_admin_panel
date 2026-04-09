import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import type { Subscription } from "../Models/Subscription";
import { toast } from "../../utils/Toast";

export default function SubscriptionDetail() {
  const { id } = useParams();
  const [sub, setSub] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSubscription();
  }, [id]);

  async function fetchSubscription() {
    if (!id) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/api/v1/subscription/${id}`,
        { withCredentials: true }
      );
      setSub(res.data);
    } catch (err) {
      toast.error("Failed to load subscription");
    } finally {
      setLoading(false);
    }
  }

  const periodColors: Record<string, string> = {
    monthly: "#42B883",
    yearly: "#6366F1",
    quarterly: "#B07D2A",
    weekly: "#D05A3C",
  };

  const now = new Date();
  const monthLabel = now.toLocaleString("en-GB", { month: "long", year: "numeric" });

  if (loading) {
    return (
      <div className="p-6 bg-[#EAEAEA] min-h-screen">
        <div className="text-center text-[#888] py-20 text-sm">Loading...</div>
      </div>
    );
  }

  if (!sub) {
    return (
      <div className="p-6 bg-[#EAEAEA] min-h-screen">
        <div className="text-center text-[#D05A3C] py-20 text-sm">Subscription not found.</div>
      </div>
    );
  }

  const color = periodColors[sub.billing_period] ?? "#42B883";
  const initials = (sub.subscription_name ?? "??").slice(0, 2).toUpperCase();

  function formatDate(d?: string) {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }

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
            Back to subscriptions
          </button>
          <h1 className="text-xl font-semibold text-[#1A1A1A]">{sub.subscription_name}</h1>
          <p className="text-xs text-[#888]">{monthLabel} · Subscription detail</p>
        </div>
        <button
          onClick={() => navigate(`/users/${sub.user_id}`)}
          className="cursor-pointer px-4 py-2 bg-[#42B883] text-white rounded-lg hover:bg-[#2D8A63] transition text-sm"
        >
          View user →
        </button>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Price</p>
          <p className="text-2xl font-semibold text-[#1A1A1A]">
            €{(Number(sub.price) || 0).toFixed(2)}
          </p>
          {sub.billing_period && (
            <p className="text-[11px] mt-1" style={{ color }}>per {sub.billing_period.replace("ly", "")}</p>
          )}
        </div>
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Billing period</p>
          <p className="text-base font-semibold capitalize" style={{ color }}>
            {sub.billing_period || "—"}
          </p>
        </div>
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Billing date</p>
          <p className="text-2xl font-semibold text-[#1A1A1A]">
            {sub.billing_date ? `Day ${sub.billing_date}` : "—"}
          </p>
        </div>
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Type</p>
          <p className="text-base font-semibold text-[#1A1A1A]">{sub.typ || "—"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">

        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-3">Subscription identity</p>

          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-lg font-semibold flex-shrink-0"
              style={{ background: color + "20", color }}
            >
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">{sub.subscription_name}</p>
              <button
                onClick={() => navigate(`/users/${sub.user_id}`)}
                className="text-xs text-[#888] hover:text-[#42B883] hover:underline transition cursor-pointer"
              >
                {sub.user_email || "—"}
              </button>
              {sub.tag && (
                <div className="mt-1">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: (sub.tag.tag_color ?? "#999") + "20", color: sub.tag.tag_color ?? "#999" }}
                  >
                    {sub.tag.tag_name}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#F0F0F0]">
            <InfoRow label="Contract number" value={sub.contract_number} />
            <InfoRow label="Customer number" value={sub.customer_number} />
            <InfoRow label="Payment method" value={sub.payment_method} />
          </div>
        </div>

        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-3">Company</p>

          {sub.company ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0 bg-[#42B883]/10 text-[#42B883]">
                  {(sub.company.company_name ?? "??").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1A1A1A]">{sub.company.company_name}</p>
                  <p className="text-[10px] text-[#888] capitalize">{sub.company.category || "—"}</p>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-[#F0F0F0]">
                <InfoRow label="Contact" value={sub.company.contact_detail} />
                {sub.company.link && (
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] text-[#888]">Website</p>
                    <a
                      href={sub.company.link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-[#42B883] hover:underline"
                    >
                      Visit →
                    </a>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-xs text-[#888]">No company linked.</p>
          )}
        </div>

      </div>

      <div className="grid grid-cols-2 gap-3">

        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-3">Timeline</p>

          <div className="space-y-2">
            {[
              { label: "Contract start", value: formatDate(sub.contract_start_date) },
              { label: "Contract end", value: formatDate(sub.contract_end_date) },
              { label: "Billing date", value: sub.billing_date ? `Day ${sub.billing_date}` : "—" },
              { label: "Billing period", value: sub.billing_period, accent: true },
              { label: "Cancellation period", value: sub.cancellation_period },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-2.5 rounded-xl border border-[#D8D8D8]">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.accent ? color : "#D8D8D8" }} />
                  <p className="text-xs text-[#555]">{item.label}</p>
                </div>
                <p
                  className="text-xs font-medium capitalize"
                  style={{ color: item.accent ? color : "#1A1A1A" }}
                >
                  {item.value || "—"}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-3">Notes</p>

          {sub.note ? (
            <p className="text-xs text-[#555] leading-relaxed">{sub.note}</p>
          ) : (
            <div className="text-xs text-[#888] py-4 text-center">No notes for this subscription.</div>
          )}

          <div className="mt-4 pt-3 border-t border-[#F0F0F0]">
            <p className="text-[10px] text-[#888]">
              Subscription ID:{" "}
              <span className="font-medium text-[#1A1A1A]">#{sub.id}</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-[11px] text-[#888]">{label}</p>
      <p className="text-xs font-medium text-[#1A1A1A]">{value || "—"}</p>
    </div>
  );
}