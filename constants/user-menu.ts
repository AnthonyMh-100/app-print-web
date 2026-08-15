import type { IconType } from "react-icons";
import { IoReceiptOutline, IoSettingsOutline } from "react-icons/io5";

export interface UserMenuLink {
  id: string;
  label: string;
  href: string;
  icon: IconType;
}

export const USER_MENU_LINKS: UserMenuLink[] = [
  {
    id: "orders",
    label: "Mis pedidos",
    href: "/orders",
    icon: IoReceiptOutline,
  },
];

export const OWNER_MENU_LINKS: UserMenuLink[] = [
  {
    id: "admin",
    label: "Panel de administración",
    href: "/admin",
    icon: IoSettingsOutline,
  },
];