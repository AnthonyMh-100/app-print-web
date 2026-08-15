import type { IconType } from "react-icons";
import {
  IoChatbubbleEllipsesOutline,
  IoGridOutline,
  IoRocketOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import type { NavIconName } from "@/interfaces/icon";

const ICONS: Record<NavIconName, IconType> = {
  grid: IoGridOutline,
  rocket: IoRocketOutline,
  shield: IoShieldCheckmarkOutline,
  chat: IoChatbubbleEllipsesOutline,
};

interface IoIconProps {
  name: NavIconName;
  className?: string;
}

export function IoIcon({ name, className }: IoIconProps) {
  const Component = ICONS[name];

  return <Component className={className} aria-hidden="true" />;
}
