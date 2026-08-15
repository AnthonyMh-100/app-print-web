import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon?: ReactNode;
  error?: string;
}

export function InputField({
  id,
  label,
  icon,
  error,
  className,
  ...props
}: InputFieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
            {icon}
          </span>
        )}
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(icon ? "pl-10" : undefined, className)}
          {...props}
        />
      </div>
      {error && (
        <span id={`${id}-error`} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
