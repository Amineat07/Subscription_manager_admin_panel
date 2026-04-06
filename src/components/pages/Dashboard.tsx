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

  if (loading) {
    return (
      <div className="p-6 text-[13px] text-[#777]">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">

      <div>
        <h2 className="text-[22px] font-semibold text-[#111]">
          Dashboard
        </h2>
        <p className="text-[13px] text-[#777] mt-1">
          Overview of your SaaS platform
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        <Card title="Users" value={stats?.users ?? 0} />
        <Card title="Subscriptions" value={stats?.subscriptions ?? 0} />
        <Card title="NewsFeed Posts" value={stats?.newsfeed ?? 0} />
        <Card title="Open Tickets" value={stats?.tickets?.open ?? 0} danger />

      </div>

      <div className="bg-white border rounded-xl p-5">

        <h3 className="text-[14px] font-medium mb-4">
          Ticket Overview
        </h3>

        <div className="grid grid-cols-3 gap-4">

          <StatBox label="Open" value={stats?.tickets?.open ?? 0} color="#B45309" />
          <StatBox label="In Progress" value={stats?.tickets?.in_progress ?? 0} color="#2563EB" />
          <StatBox label="Closed" value={stats?.tickets?.closed ?? 0} color="#2D8A63" />

        </div>

      </div>

    </div>
  );
}


function Card({
  title,
  value,
  danger,
}: {
  title: string;
  value: any;
  danger?: boolean;
}) {
  return (
    <div className="bg-white border rounded-xl p-4">
      <p className="text-[12px] text-[#999]">{title}</p>

      <p className="text-[20px] font-semibold text-[#111] mt-1">
        {value}
      </p>

      <p
        className={`text-[11px] mt-1 ${
          danger ? "text-red-500" : "text-[#2D8A63]"
        }`}
      >
        live data
      </p>
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="border rounded-xl p-4">
      <p className="text-[12px] text-[#777]">{label}</p>

      <p className="text-[18px] font-semibold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}