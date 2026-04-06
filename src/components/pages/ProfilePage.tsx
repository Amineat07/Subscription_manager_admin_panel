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

  if (loading) {
    return (
      <div className="text-[13px] text-[#999999]">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-[13px] text-red-500">
        Failed to load user
      </div>
    );
  }

  const fullName = `${user.first_name} ${user.last_name}`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[18px] font-medium text-[#1A1A1A]">
          Profile
        </h2>
        <p className="text-[12px] text-[#999999]">
          Manage your account information
        </p>
      </div>

      <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5 flex flex-col md:flex-row gap-6">
        <div className="flex flex-col items-center gap-2 min-w-[120px]">
          <div className="w-[80px] h-[80px] rounded-full bg-[#E6F7F1] flex items-center justify-center text-[20px] font-medium text-[#2D8A63]">
            {user.first_name?.[0]}
            {user.last_name?.[0]}
          </div>

          <p className="text-[13px] font-medium text-[#1A1A1A]">
            {fullName}
          </p>

          <p className="text-[11px] text-[#999999]">
            {user.email}
          </p>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] text-[#999999]">Full Name</p>
            <p className="text-[13px] text-[#1A1A1A]">
              {fullName}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-[#999999]">Email</p>
            <p className="text-[13px] text-[#1A1A1A]">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-[#999999]">Role</p>
            <p className="text-[13px] text-[#2D8A63] font-medium">
              {user.role}
            </p>
          </div>

          <div>
            <p className="text-[11px] text-[#999999]">Member since</p>
            <p className="text-[13px] text-[#1A1A1A]">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#EBEBEB] rounded-[12px] p-5">
        <h3 className="text-[14px] font-medium text-[#1A1A1A] mb-4">
          Security
        </h3>

        <button className="w-full flex items-center justify-between px-4 py-3 rounded-[10px] bg-[#F9F9F9] hover:bg-[#F4F4F4]">
          <div>
            <p className="text-[13px]">Change Password</p>
            <p className="text-[11px] text-[#999999]">
              Update your password
            </p>
          </div>
          <span>{icons.chevronRight}</span>
        </button>
      </div>
    </div>
  );
}