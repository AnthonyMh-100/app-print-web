import Image from "next/image";
import { IoPersonCircleOutline } from "react-icons/io5";
import { cn } from "@/utils/cn";

interface AvatarProps {
  src?: string | null;
  alt?: string | null;
  name?: string | null;
  className?: string;
}

export function Avatar({ src, alt, name, className }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt ?? "Avatar de usuario"}
        width={20}
        height={20}
        className={cn("h-4 w-4 shrink-0 rounded-full object-cover", className)}
      />
    );
  }

  const initials = name?.trim().slice(0, 2).toUpperCase();

  if (initials) {
    return (
      <span
        role="img"
        aria-label={alt ?? "Avatar de usuario"}
        className={cn(
          "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-canvas text-[12px] font-semibold tracking-wide text-blue-deep",
          className,
        )}
      >
        {initials}
      </span>
    );
  }

  return (
    <IoPersonCircleOutline
      className={cn("h-8 w-8 shrink-0 text-muted", className)}
      aria-hidden="true"
    />
  );
}
