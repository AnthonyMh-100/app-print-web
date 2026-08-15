import type { Satellite } from "@/interfaces/orbit";

export const SATELLITES: Satellite[] = [
  {
    angle: "0deg",
    radius: "var(--r1)",
    dot: "bg-blue",
    label: "Tazas",
    href: "/catalog?categoria=tazas-personalizadas",
  },
  {
    angle: "72deg",
    radius: "var(--r2)",
    dot: "bg-honey",
    label: "Textiles",
    href: "/catalog?categoria=textiles-personalizados",
  },
  {
    angle: "144deg",
    radius: "var(--r1)",
    dot: "bg-pink",
    label: "Almanaques",
    href: "/catalog?categoria=almanaques-personalizados",
  },
  {
    angle: "216deg",
    radius: "var(--r2)",
    dot: "bg-turquoise",
    label: "Otros",
    href: "/catalog?categoria=otros",
  },
  {
    angle: "288deg",
    radius: "var(--r1)",
    dot: "bg-coral",
    label: "Ver todo",
    href: "/catalog",
  },
];
