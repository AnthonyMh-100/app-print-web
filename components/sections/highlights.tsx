import { Container } from "@/components/ui/container";
import { Stagger } from "@/components/ui/stagger";
import { StaggerItem } from "@/components/ui/stagger-item";
import { HIGHLIGHTS } from "@/constants/highlights";
import type { Highlight } from "@/interfaces/highlight";

function HighlightItem({ icon, background, color, title, text }: Highlight) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-10.5 w-10.5 shrink-0 items-center justify-center rounded-xl"
        style={{ background }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-5.5 w-5.5"
        >
          <path d={icon} />
        </svg>
      </div>
      <div>
        <strong className="block text-sm font-semibold text-ink">
          {title}
        </strong>
        <span className="text-[12.5px] text-muted">{text}</span>
      </div>
    </div>
  );
}

export function Highlights() {
  return (
    <div className="border-b border-line bg-paper py-6.5">
      <Container>
        <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 nav:grid-cols-4">
          {HIGHLIGHTS.map((highlight) => (
            <StaggerItem key={highlight.title}>
              <HighlightItem {...highlight} />
            </StaggerItem>
          ))}
        </Stagger>
      </Container>
    </div>
  );
}
