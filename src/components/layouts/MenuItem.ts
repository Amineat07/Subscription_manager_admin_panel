import { icons } from "../../assets/icons";
import type { NavItem } from "./NavItemModel";

export const adminNavItems: NavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: icons.dashboard },
  { to: "users", label: "Users", icon: icons.users },
  {
    to: "subscriptions",
    label: "Subscriptions",
    icon: icons.subscriptions,
  },
  { to: "newsfeeds", label: "Newsfeed", icon: icons.newsfeed },
  { to: "tickets", label: "Tickets", icon: icons.tickets },
];