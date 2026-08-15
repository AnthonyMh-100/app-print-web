interface BrandMarkProps {
  size?: number;
  variant?: "canvas" | "white";
}

export function BrandMark({ size = 42, variant = "canvas" }: BrandMarkProps) {
  const innerFill = variant === "white" ? "fill-white" : "fill-canvas";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="10" r="7" className="fill-blue" />
      <circle cx="36" cy="10" r="7" className="fill-blue" />
      <circle cx="12" cy="10" r="3.4" className={innerFill} />
      <circle cx="36" cy="10" r="3.4" className={innerFill} />
      <circle cx="24" cy="24" r="17" className="fill-blue" />
      <circle cx="24" cy="26" r="12.5" className={innerFill} />
      <circle cx="19" cy="24" r="2" className="fill-ink" />
      <circle cx="29" cy="24" r="2" className="fill-ink" />
      <ellipse cx="24" cy="30" rx="3" ry="2.2" className="fill-blue" />
    </svg>
  );
}
