import { useEffect, useState } from "react";
import axios from "axios";
import { icons } from "../../assets/icons";
import type { User } from "../Models/User";
import { toast } from "../../utils/Toast";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/admin/users`, {
        withCredentials: true,
      });

      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!id || isNaN(id)) {
      toast.error("Invalid user id");
      return;
    }

    const result = await toast.danger(
      "Delete user?",
      "This action cannot be undone.",
    );

    if (!result.isConfirmed) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/admin/users/${id}`, {
        withCredentials: true,
      });

      setUsers((prev) => prev.filter((u) => u.user_ID !== id));

      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Delete failed");
    }
  }

  useEffect(() => {
    console.log("USERS:", users);
  }, [users]);

  if (loading) {
    return <div className="text-[13px] text-[#999999]">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[18px] font-medium text-[#1A1A1A]">Users</h2>
        <p className="text-[12px] text-[#999999]">Manage all platform users</p>
      </div>

      <div className="bg-white border border-[#EBEBEB] rounded-[12px] overflow-hidden">
        <div className="grid grid-cols-5 text-[11px] text-[#999999] bg-[#FAFAFA] px-4 py-3">
          <span>Name</span>
          <span>Email</span>
          <span>Role</span>
          <span>Created</span>
          <span className="text-right">Actions</span>
        </div>

        {users.map((user) => (
          <div
            key={user.user_ID}
            className="grid grid-cols-5 px-4 py-3 items-center border-t border-[#F0F0F0] hover:bg-[#FAFAFA]"
          >
            <div className="text-[13px] text-[#1A1A1A]">
              {user.first_name} {user.last_name}
            </div>

            <div className="text-[13px] text-[#555555]">{user.email}</div>

            <div>
              <span className="text-[12px] px-2 py-1 rounded-full bg-[#E6F7F1] text-[#2D8A63]">
                {user.role}
              </span>
            </div>

            <div className="text-[12px] text-[#999999]">
              {new Date(user.created_at).toLocaleDateString()}
            </div>

            <div className="flex justify-end gap-2">
              <button
                className="p-2 rounded-[8px] hover:bg-[#F0F0F0]"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/users/${user.user_ID}`);
                }}
              >
                {icons.profile}
              </button>

              <button
                onClick={() => handleDelete(user.user_ID)}
                className="p-2 rounded-[8px] hover:bg-red-50 text-red-500"
              >
                {icons.trash}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
