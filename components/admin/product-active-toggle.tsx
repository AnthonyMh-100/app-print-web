"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleProductActive } from "@/actions/action-products";
import { Switch } from "./ui/switch";

interface ProductActiveToggleProps {
  id: number;
  active: boolean;
  name: string;
}

export function ProductActiveToggle({ id, active, name }: ProductActiveToggleProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    const formData = new FormData();
    formData.set("id", String(id));
    formData.set("active", String(!active));

    startTransition(async () => {
      const result = await toggleProductActive(formData);
      if (result.success) router.refresh();
    });
  };

  return (
    <div className="flex items-center gap-2" aria-busy={isPending}>
      <Switch
        checked={active}
        label={`Activo: ${name}`}
        onClick={handleToggle}
      />
      <span
        className={`text-[11.5px] font-medium ${active ? "text-blue-deep" : "text-muted"}`}
      >
        {active ? "Activo" : "Inactivo"}
      </span>
    </div>
  );
}