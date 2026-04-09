import { useState } from "react";
import { NavLink, useLocation, Outlet, useNavigate } from "react-router-dom";
import { icons } from "../../assets/icons";
import { SidebarContent } from "./SideBare";
import { adminNavItems } from "./MenuItem";
import { toast } from "../../utils/Toast";
import { authAPI, handleApiError } from "../../services/adminApi";

interface LayoutProps {
  title?: string;
  action?: React.ReactNode;
  notificationCount?: number;
}

export default function Layout({
  title,
  action,
  notificationCount = 0,
}: LayoutProps) {
  const [profileOpen, setProfileOpen] = useState(false);

  const [collapsed, setCollapsed] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const pageTitle =
    title ??
    adminNavItems.find((n) => location.pathname.startsWith(n.to))?.label ??
    "Admin";

  async function handleLogout() {
    const result = await toast.confirm(
      "Sign out?",
      "You'll be redirected to the login page.",
    );
    if (!result.isConfirmed) return;

    try {
      await authAPI.logout();
    } catch (error) {
      console.error(handleApiError(error));
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("role");
      navigate("/login");
    }
  }

  return (
    <div className="min-h-screen bg-[#EAEAEA] flex font-['DM_Sans',_'Inter',_system-ui,_sans-serif]">
      <aside
        className={[
          "hidden md:flex flex-col bg-white border-r border-[#EBEBEB] sticky top-0 h-screen shrink-0 transition-all duration-200 z-30",
          collapsed ? "w-[60px]" : "w-[220px]",
        ].join(" ")}
      >
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="bg-white border-b border-[#EBEBEB] sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-3 px-5 h-[56px]">
            <h1 className="text-[16px] font-medium text-[#1A1A1A] truncate">
              {pageTitle}
            </h1>

            <div className="hidden sm:flex flex-1 max-w-[280px] ml-4">
              <div className="relative w-full">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BBBBBB]">
                  {icons.search}
                </span>
                <input
                  type="text"
                  placeholder="Search…"
                  className="w-full bg-[#F4F4F4] border border-[#EBEBEB] rounded-[8px] pl-9 pr-3 py-[7px] text-[13px] outline-none"
                />
              </div>
            </div>

            <div className="flex-1" />

            {action && <div className="shrink-0">{action}</div>}

            <button className="relative p-2 rounded-[8px] text-[#999999]">
              {icons.bell}
              {notificationCount > 0 && (
                <span className="absolute top-1 right-1 w-[7px] h-[7px] bg-[#D05A3C] rounded-full" />
              )}
            </button>

            <div className="relative shrink-0">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-[9px] hover:bg-[#F4F4F4]"
              >
                <div className="w-[30px] h-[30px] rounded-full bg-[#E6F7F1] flex items-center justify-center text-[12px] font-medium text-[#2D8A63]">
                  A
                </div>
                <span className="hidden sm:block text-[12px]">Admin</span>
              </button>

              {profileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setProfileOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1.5 w-[180px] bg-white border border-[#EBEBEB] rounded-[10px] z-40 shadow">
                    <NavLink
                      to="/profile"
                      className="block px-3 py-2 text-[13px]"
                      onClick={() => setProfileOpen(false)}
                    >
                      Profle
                    </NavLink>

                    <button
                      onClick={() => {
                        setProfileOpen(false);
                        handleLogout();
                      }}
                      className="w-full text-left px-3 py-2 text-[13px] text-red-500"
                    >
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 md:p-6 overflow-auto">
          <Outlet />
        </main>

        <footer className="px-6 py-3 border-t border-[#EBEBEB] bg-white flex justify-between">
          <p className="text-[11px] text-[#BBBBBB]">Subtrack Admin · v1.0</p>
          <p className="text-[11px] text-[#BBBBBB]">© 2026 Subtrack GmbH</p>
        </footer>
      </div>
    </div>
  );
}