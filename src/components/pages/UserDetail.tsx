import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import type { User } from "../Models/User";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetchUser();
  }, [id]);

  async function fetchUser() {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/v1/admin/users/${id}`,
        { withCredentials: true }
      );

      setUser(res.data);
    } catch (err) {
      console.error("Failed to load user", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="text-[13px] text-[#999]">Loading user...</div>;
  }

  if (!user) {
    return <div className="text-[13px] text-red-500">User not found</div>;
  }

  return (
    <div className="space-y-6">

      <div className="space-y-3">

        <button
          onClick={() => navigate(-1)}
          className="text-[12px] px-3 py-1.5 rounded-lg border border-[#EDEDED] bg-white text-[#444] hover:bg-[#FAFAFA] transition w-fit"
        >
          ← Back
        </button>

        <div>
          <h2 className="text-[20px] font-medium text-[#111] tracking-tight">
            {user.first_name} {user.last_name}
          </h2>

          <p className="text-[12px] text-[#999]">
            {user.email}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 space-y-4">

          <h3 className="text-[12px] uppercase tracking-widest text-[#B0B0B0]">
            Profile
          </h3>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-[#888]">First name</span>
              <span className="text-[#111]">{user.first_name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#888]">Last name</span>
              <span className="text-[#111]">{user.last_name}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#888]">Email</span>
              <span className="text-[#111]">{user.email}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#888]">Role</span>

              <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E6F7F1] text-[#2D8A63]">
                {user.role}
              </span>
            </div>

          </div>
        </div>

        <div className="bg-white border border-[#EBEBEB] rounded-xl p-5 space-y-4">

          <h3 className="text-[12px] uppercase tracking-widest text-[#B0B0B0]">
            System
          </h3>

          <div className="space-y-3 text-sm">

            <div className="flex justify-between">
              <span className="text-[#888]">User ID</span>
              <span className="text-[#111]">{user.user_ID}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#888]">Created</span>
              <span className="text-[#111]">
                {new Date(user.created_at).toLocaleDateString()}
              </span>
            </div>

            {user.updated_at && (
              <div className="flex justify-between">
                <span className="text-[#888]">Updated</span>
                <span className="text-[#111]">
                  {new Date(user.updated_at).toLocaleDateString()}
                </span>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}