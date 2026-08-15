import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Stagger } from "@/components/ui/stagger";
import { StaggerItem } from "@/components/ui/stagger-item";
import { BTN_BASE } from "@/constants/button";
import { WHATSAPP_HREF } from "@/constants/navigation";import { cn } from "@/utils/cn";
import { OrbitScene } from "./orbit-scene";

function GiftIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="h-4 w-4"
    >
      <rect width="18" height="4" x="3" y="8" rx="1" />
      <path d="M12 8v13" />
      <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
      <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8h-4.5z" />
      <path d="M12 8h4.5a2.5 2.5 0 0 0 0-5C13 3 12 8 12 8z" />
    </svg>
  );
}

export function Banner() {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(118deg,#0c447c_0%,#16508f_36%,#5c4a77_66%,#a03f51_86%,#d8492f_100%)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,rgba(255,255,255,0.08),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_20%,rgba(255,111,89,0.24),transparent_50%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_90%,rgba(255,182,72,0.16),transparent_55%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />
      <Container className="relative z-10">
        <Stagger
          trigger="mount"
          className="grid items-center gap-12.5 py-16 pb-21 nav:grid-cols-[1.05fr_0.95fr]"
        >
          <div>
            <StaggerItem>
              <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.75 text-[13px] font-semibold text-white">
                <GiftIcon />
                Hecho a mano, pensado para ti
              </span>
            </StaggerItem>
            <StaggerItem>
              <h1 className="font-disp text-[clamp(32px,4.6vw,50px)] font-bold leading-[1.14] text-white">
                Ideas que se convierten en regalos{" "}
                <em className="rounded-md bg-honey px-2 py-px not-italic text-ink [box-decoration-break:clone]">
                  únicos
                </em>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-5 max-w-115 text-[16.5px] text-white/80">
                Tazas, textiles, cristales y mucho más — todo personalizado a
                tu gusto. Cuéntanos tu idea por WhatsApp y la convertimos en
                realidad.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-7.5 flex flex-wrap gap-3.5">
                <Link
                  href="/catalog"
                  className={cn(
                    BTN_BASE,
                    "bg-coral text-white shadow-[0_12px_26px_rgba(33,42,58,0.16)] hover:-translate-y-0.5 hover:bg-coral-deep",
                  )}
                >
                  Ver catálogo
                </Link>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener"
                  className={cn(
                    BTN_BASE,
                    "border-[1.5px] border-white/55 text-white hover:-translate-y-0.5 hover:bg-white hover:text-blue-deep",
                  )}
                >
                  Escríbenos a WhatsApp
                </a>
              </div>
              <div className="mt-4 flex flex-col gap-0.5 text-[12px] text-white/70">
                <p>Hecho a mano en Perú · Personalizado a tu gusto</p>
                <p>Envíos a todo el país · Pagás al recibir</p>
              </div>
            </StaggerItem>
          </div>

          <StaggerItem>
            <OrbitScene />
          </StaggerItem>
        </Stagger>
      </Container>

      <div aria-hidden="true" className="-mb-px block leading-none">
        <svg
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          className="block h-14 w-full fill-paper"
        >
          <path d="M0,20 C240,55 480,0 720,15 C960,30 1200,50 1440,10 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}