"use client";

import { useState } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { AUTH } from "@/constants/auth";
import { cn } from "@/utils/cn";

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  icon?: ReactNode;
  error?: string;
}

export function PasswordInput({
  id,
  label,
  icon,
  error,
  className,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

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
          type={visible ? "text" : "password"}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className={cn(icon ? "pl-10" : undefined, "pr-11", className)}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={
            visible ? AUTH.hidePasswordLabel : AUTH.showPasswordLabel
          }
          aria-pressed={visible}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted transition-colors duration-200 hover:text-ink"
        >
          {visible ? (
            <IoEyeOffOutline size={18} aria-hidden="true" />
          ) : (
            <IoEyeOutline size={18} aria-hidden="true" />
          )}
        </button>
      </div>
      {error && (
        <span id={`${id}-error`} className="field-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
