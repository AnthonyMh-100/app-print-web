import { cn } from "@/utils/cn";

interface ProductThumbProps {
  name: string;
  cardColor?: string | null;
  imageUrl?: string | null;
  className?: string;
}

export function ProductThumb({ name, cardColor, imageUrl, className }: ProductThumbProps) {
  const bg = cardColor ?? "#e6f1fb";

  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line",
        className,
      )}
      style={{ background: `linear-gradient(160deg, ${bg} 0%, #ffffff 130%)` }}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <span className="text-[15px] font-bold text-[#0c447c]">{name.slice(0, 1)}</span>
      )}
    </span>
  );
}