import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { IoChevronDownOutline } from "react-icons/io5";
import { cn } from "@/utils/cn";

const CONTROL_CLASSES =
  "w-full rounded-[10px] border border-line bg-paper px-3.5 py-2.5 text-[14px] text-ink placeholder:text-muted/60 transition-[border-color,box-shadow] focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue/10";

interface FieldProps {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function Field({ id, label, hint, children, className }: FieldProps) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[12.5px] font-semibold text-ink"
      >
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-[11.5px] text-muted">{hint}</p>}
    </div>
  );
}

export function Input({ id, className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input id={id} className={cn(CONTROL_CLASSES, className)} {...props} />;
}

export function Textarea({
  id,
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      id={id}
      className={cn(CONTROL_CLASSES, "min-h-28 resize-y", className)}
      {...props}
    />
  );
}

export function Select({
  id,
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        id={id}
        className={cn(CONTROL_CLASSES, "appearance-none pr-10", className)}
        {...props}
      >
        {children}
      </select>
      <IoChevronDownOutline
        className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        aria-hidden="true"
      />
    </div>
  );
}
