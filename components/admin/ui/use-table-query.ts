"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type QueryPatch = Record<string, string | number | null>;

export function useTableQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return useCallback(
    (patch: QueryPatch) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === "") {
          params.delete(key);
        } else if (key === "page" && Number(value) <= 1) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );
}