import { RIBBON_STRIPES } from "@/constants/ribbon";

export function Ribbon() {
  return (
    <div aria-hidden="true" className="mt-1.5 flex h-2 w-full">
      {RIBBON_STRIPES.map((stripe) => (
        <span key={stripe} className={`flex-1 ${stripe}`} />
      ))}
    </div>
  );
}
