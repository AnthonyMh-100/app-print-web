import Link from "next/link";
import { BRAND_NAME } from "@/constants/navigation";
import { BrandMark } from "./brand-mark";

interface HeaderLogoProps {
  href?: string;
  brandName?: string;
}

export function HeaderLogo({ href = "/", brandName }: HeaderLogoProps) {
  return (
    <Link
      href={href}
      className="flex shrink-0 items-center gap-2 font-disp text-[18px] font-bold leading-none text-blue-deep transition-opacity duration-200 hover:opacity-90"
    >
      <BrandMark size={34} />
      <span>{brandName ?? BRAND_NAME}</span>
    </Link>
  );
}
