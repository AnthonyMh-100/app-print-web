import type { InputHTMLAttributes } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { cn } from "@/utils/cn";

interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  className?: string;
}

export function SearchInput({ placeholder = "Buscar…", className, ...props }: SearchInputProps) {
  return (
    <div className={cn("relative", className)}>
      <IoSearchOutline
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        placeholder={placeholder}
        className="w-full rounded-full border border-line bg-paper py-2.5 pl-10 pr-4 text-[13.5px] text-ink placeholder:text-muted/60 transition-[border-color,box-shadow] focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/10"
        {...props}
      />
    </div>
  );
}