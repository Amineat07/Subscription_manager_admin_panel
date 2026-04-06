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
        { withCredentials: true },
      );

      setSub(res.data);
    } catch (err) {
      toast.error("Failed to load subscription");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div className="text-[#999] text-[13px]">Loading...</div>;
  if (!sub) return <div className="text-red-500 text-[13px]">Not found</div>;

  const Card = ({ title, children }: any) => (
    <div className="bg-white rounded-2xl border border-[#EEE] shadow-sm p-5 hover:shadow-md transition">
      <h3 className="text-[11px] uppercase tracking-widest text-[#999] mb-4">
        {title}
      </h3>
      {children}
    </div>
  );

  const Row = ({ label, value }: any) => (
    <div className="flex justify-between py-2 text-[13px]">
      <span className="text-[#888]">{label}</span>
      <span className="text-[#111] font-medium">{value || "-"}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-[#0F2F26] to-[#145A43] text-white rounded-2xl p-6 shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="text-[12px] text-[#ccc] hover:text-white mb-3"
        >
          ← Back
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-semibold">
              {sub.subscription_name}
            </h1>

            <button
              onClick={() => navigate(`/users/${sub.user_id}`)}
              className="mt-2 text-[12px] text-[#D1D5DB] hover:text-white underline"
            >
              {sub.user_email}
            </button>
          </div>

          <div className="text-right">
            <p className="text-[12px] text-[#9CA3AF]">Price</p>
            <p className="text-[20px] font-bold">${sub.price}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card title="Contract">
          <Row label="Contract" value={sub.contract_number} />
          <Row label="Customer" value={sub.customer_number} />
          <Row label="Type" value={sub.typ} />
          <Row label="Payment" value={sub.payment_method} />
        </Card>

        <Card title="Company">
          <p className="text-[15px] font-semibold text-[#111]">
            {sub.company?.company_name}
          </p>

          <p className="text-[12px] text-[#666] mt-1">
            {sub.company?.category}
          </p>

          <p className="text-[12px] text-[#777] mt-1">
            {sub.company?.contact_detail}
          </p>

          {sub.company?.link && (
            <a
              href={sub.company.link}
              target="_blank"
              className="text-[12px] text-blue-500 hover:underline mt-2 inline-block"
            >
              Visit →
            </a>
          )}
        </Card>

        <Card title="Tag">
          {sub.tag ? (
            <span
              className="text-[12px] px-3 py-1 rounded-full font-medium"
              style={{
                backgroundColor: `${sub.tag.tag_color ?? "#999"}20`,
                color: sub.tag.tag_color ?? "#999",
              }}
            >
              {sub.tag.tag_name}
            </span>
          ) : (
            <span className="text-[12px] text-[#999]">No tag</span>
          )}
        </Card>
      </div>

      <Card title="Timeline">
        <Row label="Start" value={sub.contract_start_date} />
        <Row label="End" value={sub.contract_end_date} />
        <Row label="Billing date" value={sub.billing_date} />
        <Row label="Billing period" value={sub.billing_period} />
        <Row label="Cancel period" value={sub.cancellation_period} />
      </Card>

      <Card title="Notes">
        <p className="text-[13px] text-[#555] leading-relaxed">
          {sub.note || "No notes"}
        </p>
      </Card>
    </div>
  );
}
