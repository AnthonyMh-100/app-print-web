import type { SVGProps } from "react";
import { ICON_PATHS } from "@/constants/icons";
import type { IconName } from "@/interfaces/icon";

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
}

export function Icon({ name, width = 16, height = 16, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      width={width}
      height={height}
      aria-hidden="true"
      {...props}
    >
      {ICON_PATHS[name]}
    </svg>
  );
}
