import { NavLink } from "react-router-dom";
import type { NavItem } from "./NavItemModel";


export function SideNavItem({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  return (
    <NavLink
      to={item.to}
      title={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        [
          "relative flex items-center gap-2.5 rounded-[8px] text-[13px] font-medium transition-all duration-150 group",
          collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
          isActive
            ? "bg-[#E6F7F1] text-[#2D8A63]"
            : "text-[#555555] hover:bg-[#F4F4F4] hover:text-[#1A1A1A]",
        ].join(" ")
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#42B883] rounded-r-full" />
          )}

          <span
            className={
              isActive
                ? "text-[#2D8A63]"
                : "text-[#999999] group-hover:text-[#555555]"
            }
          >
            {item.icon}
          </span>

          {!collapsed && <span className="truncate">{item.label}</span>}

          {item.badge !== undefined && item.badge > 0 && !collapsed && (
            <span className="ml-auto bg-[#D05A3C] text-white text-[10px] font-medium px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none">
              {item.badge > 99 ? "99+" : item.badge}
            </span>
          )}

          {collapsed && (
            <span className="absolute left-full ml-2.5 px-2.5 py-1.5 bg-[#1A1A1A] text-white text-[12px] rounded-[7px] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50">
              {item.label}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}
