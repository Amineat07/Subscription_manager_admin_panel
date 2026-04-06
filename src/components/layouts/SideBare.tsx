import { NavLink } from "react-router-dom";
import { adminNavItems } from "./MenuItem";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export function LogoMark({ size = 32 }: { size?: number }) {
  return (
    <div
      className="bg-[#42B883] flex items-center justify-center"
      style={{ width: size, height: size, borderRadius: size * 0.3 }}
    >
      <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 22 22">
        <rect x="2" y="2" width="8" height="8" rx="2" fill="white" />
        <rect x="12" y="2" width="8" height="8" rx="2" fill="white" />
        <rect x="2" y="12" width="8" height="8" rx="2" fill="white" />
        <rect x="12" y="12" width="8" height="8" rx="2" fill="white" opacity="0.4" />
      </svg>
    </div>
  );
}

export function SidebarContent({
  collapsed,
  setCollapsed,
}: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div
        className={[
          "flex items-center border-b border-[#EBEBEB]",
          collapsed ? "justify-center px-3 py-4" : "gap-2.5 px-4 py-4",
        ].join(" ")}
      >
        <LogoMark size={34} />
        {!collapsed && (
          <div>
            <p className="text-[14px] font-medium">Subtrack</p>
            <p className="text-[10px] text-[#999] uppercase">
              Admin panel
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 py-3 px-2">
        <nav className="flex flex-col gap-1">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  "flex items-center gap-2 rounded-[8px] text-[13px]",
                  collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
                  isActive
                    ? "bg-[#E6F7F1] text-[#2D8A63]"
                    : "text-[#555] hover:bg-[#F4F4F4]",
                ].join(" ")
              }
              title={collapsed ? item.label : undefined}
            >
              <span>{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="border-t border-[#EBEBEB] p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={[
            "flex items-center gap-2 w-full text-[12px] text-[#999] hover:bg-[#F4F4F4] rounded-[8px]",
            collapsed ? "justify-center py-2" : "px-3 py-2",
          ].join(" ")}
        >
          <svg
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            className={collapsed ? "rotate-180" : ""}
          >
            <path d="M15 19l-7-7 7-7" />
          </svg>
          {!collapsed && "Collapse"}
        </button>
      </div>
    </div>
  );
}