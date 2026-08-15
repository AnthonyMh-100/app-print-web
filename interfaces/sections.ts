import type { IconType } from "react-icons";

export interface ProcessStep {
  num: string;
  title: string;
  text: string;
}

export interface CommitmentCard {
  icon: string;
  quote: string;
  name: string;
  role: string;
  accent: string;
}

export interface ContactChannel {
  id: string;
  label: string;
  value: string;
  href: string;
  background: string;
  icon: IconType;
  external: boolean;
}
