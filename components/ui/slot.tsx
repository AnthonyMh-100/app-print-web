import { Children, cloneElement, isValidElement } from "react";
import type { ReactElement, ReactNode } from "react";
import { cn } from "@/utils/cn";

interface SlotProps {
  children: ReactNode;
  className?: string;
}

export function Slot({ children, className }: SlotProps) {
  const child = Children.only(children);
  if (!isValidElement(child)) {
    throw new Error("Slot only accepts a single React element as child");
  }
  return cloneElement(child as ReactElement<{ className?: string }>, {
    className: cn(className, child.props.className),
  });
}
