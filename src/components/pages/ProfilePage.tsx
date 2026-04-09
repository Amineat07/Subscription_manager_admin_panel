import { useEffect, useState } from "react";
import axios from "axios";
import { icons } from "../../assets/icons";
import type { User } from "../Models/User";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/v1/me`,
          { withCredentials: true }
        );
        setUser(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, []);

  const now = new Date();
  const monthLabel = now.toLocaleString("en-GB", { month: "long", year: "numeric" });

  if (loading) {
    return (
      <div className="p-6 bg-[#EAEAEA] min-h-screen">
        <div className="text-center text-[#888] py-20 text-sm">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-6 bg-[#EAEAEA] min-h-screen">
        <div className="text-center text-[#D05A3C] py-20 text-sm">Failed to load user.</div>
      </div>
    );
  }

  const fullName = `${user.first_name} ${user.last_name}`;
  const initials = `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`;
  const memberSince = new Date(user.created_at);
  const memberDays = Math.floor((now.getTime() - memberSince.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="p-6 bg-[#EAEAEA] min-h-screen">

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold text-[#1A1A1A]">Profile</h1>
          <p className="text-xs text-[#888]">
            {monthLabel} · Manage your account information
          </p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Full name</p>
          <p className="text-base font-semibold text-[#1A1A1A] truncate">{fullName}</p>
        </div>
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Role</p>
          <p className="text-base font-semibold text-[#42B883] capitalize">{user.role}</p>
        </div>
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Member since</p>
          <p className="text-base font-semibold text-[#1A1A1A]">
            {memberSince.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-1">Days active</p>
          <p className="text-2xl font-semibold text-[#1A1A1A]">{memberDays}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">

        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-3">Account identity</p>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-[#42B883]/20 flex items-center justify-center text-lg font-semibold text-[#42B883] flex-shrink-0">
              {initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1A1A1A]">{fullName}</p>
              <p className="text-xs text-[#888]">{user.email}</p>
              <span
                className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium capitalize"
                style={{ background: "#42B88320", color: "#42B883" }}
              >
                {user.role}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#F0F0F0]">
            <InfoRow label="First name" value={user.first_name} />
            <InfoRow label="Last name" value={user.last_name} />
            <InfoRow label="Email" value={user.email} />
          </div>
        </div>

        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-3">Account details</p>

          <div className="space-y-2 mb-4">
            <InfoRow label="User ID" value={`#${user.id ?? "—"}`} />
            <InfoRow
              label="Created"
              value={memberSince.toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric",
              })}
            />
            <InfoRow label="Role" value={user.role} accent />
          </div>

          <div className="pt-3 border-t border-[#F0F0F0]">
            <p className="text-[11px] uppercase text-[#888] mb-2">Account status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#42B883]" />
              <p className="text-xs font-medium text-[#1A1A1A]">Active</p>
            </div>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-2 gap-3">

        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-3">Security</p>

          <button className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#D8D8D8] hover:bg-[#F9F9F9] transition cursor-pointer">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold flex-shrink-0"
                style={{ background: "#42B88320", color: "#42B883" }}>
                PW
              </div>
              <div className="text-left">
                <p className="text-xs font-medium text-[#1A1A1A]">Change Password</p>
                <p className="text-[10px] text-[#888]">Update your login credentials</p>
              </div>
            </div>
            <span className="text-[#888]">{icons.chevronRight}</span>
          </button>
        </div>

        <div className="bg-white border border-[#D8D8D8] rounded-xl p-4">
          <p className="text-[11px] uppercase text-[#888] mb-3">Session</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#D8D8D8]">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0 bg-[#42B883]" />
                <div>
                  <p className="text-xs font-medium text-[#1A1A1A]">Current session</p>
                  <p className="text-[10px] text-[#888]">Active now</p>
                </div>
              </div>
              <p className="text-xs font-semibold text-[#42B883]">Online</p>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#F0F0F0]">
            <p className="text-[10px] text-[#888]">
              Last seen{" "}
              <span className="text-[#1A1A1A] font-medium">
                {now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}


function InfoRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <p className="text-[11px] text-[#888]">{label}</p>
      <p
        className="text-xs font-medium capitalize"
        style={{ color: accent ? "#42B883" : "#1A1A1A" }}
      >
        {value}
      </p>
    </div>
  );
}