import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { Subscription } from "../Models/Subscription";
import { toast } from "../../utils/Toast";

export default function Subscriptions() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const loadSubs = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/admin/api/v1/subscriptions`,
          { withCredentials: true },
        );

        setSubs(res.data);
      } catch (err) {
        toast.error("Failed to load subscriptions");
      }
    };

    loadSubs();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-[18px] font-medium text-[#1A1A1A]">Subscriptions</h2>

      <div className="bg-white border border-[#EBEBEB] rounded-[12px] overflow-hidden">
        <div className="grid grid-cols-6 px-4 py-3 text-[11px] text-[#999] bg-[#FAFAFA]">
          <span>Name</span>
          <span>Company</span>
          <span>Type</span>
          <span>Price</span>
          <span>Email</span>
          <span className="text-right">Actions</span>
        </div>

        {subs.map((sub) => (
          <div
            key={sub.id}
             className="grid grid-cols-6 px-4 py-3 border-t border-[#F0F0F0] items-center hover:bg-[#FAFAFA]"
          >
            <div className="text-[13px]">{sub.subscription_name}</div>

            <div className="text-[13px] text-[#666]">
              {sub.company.company_name}
            </div>

            <div className="text-[12px] text-[#999]">{sub.typ || "-"}</div>

            <div className="text-[13px] font-medium">${sub.price}</div>

            <div className="text-[13px] text-[#666]">
              {sub.user_email || "-"}
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => navigate(`/subscriptions/${sub.id}`)}
                className="p-2 rounded hover:bg-[#F0F0F0] text-[#555]"
                title="Details"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.8}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 6h9.75M10.5 12h9.75M10.5 18h9.75M4.5 6h.008v.008H4.5V6zm0 6h.008v.008H4.5V12zm0 6h.008v.008H4.5V18z"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
