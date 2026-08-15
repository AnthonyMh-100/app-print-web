import Link from "next/link";
import {
  IoLogoFacebook,
  IoLogoInstagram,
  IoLogoTiktok,
  IoLogoWhatsapp,
  IoMailOutline,
} from "react-icons/io5";
import type { IconType } from "react-icons";
import { BrandMark } from "@/components/header/brand-mark";
import { Container } from "@/components/ui/container";
import { getBusiness } from "@/lib/business";
import { BRAND_NAME, WHATSAPP_HREF, WHATSAPP_NUMBER } from "@/constants/navigation";

interface FooterContact {
  label: string;
  value: string;
  href: string;
  icon: IconType;
  external: boolean;
}

interface FooterSocial {
  label: string;
  href: string;
  icon: IconType;
}

const FOOTER_SOCIALS: FooterSocial[] = [
  { label: "Facebook", href: "https://facebook.com", icon: IoLogoFacebook },
  { label: "Instagram", href: "https://instagram.com", icon: IoLogoInstagram },
  { label: "TikTok", href: "https://tiktok.com", icon: IoLogoTiktok },
];

const DEFAULT_TAGLINE =
  "Regalos personalizados hechos con cariño: tazas, textiles, cristales y mucho más.";

export async function Footer() {
  const business = await getBusiness();

  const name = business.name || BRAND_NAME;
  const email = business.email || "creaciones.papiro@gmail.com";
  const phone = business.phone
    ? `+${business.phone.replace(/^\+/, "").replace(/[^0-9]/g, "")}`
    : null;
  const whatsappHref = business.phone
    ? `https://wa.me/${business.phone.replace(/^\+/, "").replace(/[^0-9]/g, "")}`
    : WHATSAPP_HREF;
  const description = business.footerNote || DEFAULT_TAGLINE;

  const FOOTER_CONTACTS: FooterContact[] = [
    {
      label: "WhatsApp",
      value: phone ?? `+${WHATSAPP_NUMBER}`,
      href: whatsappHref,
      icon: IoLogoWhatsapp,
      external: true,
    },
    {
      label: "Correo",
      value: email,
      href: `mailto:${email}`,
      icon: IoMailOutline,
      external: false,
    },
    {
      label: "Facebook",
      value: name,
      href: "https://facebook.com",
      icon: IoLogoFacebook,
      external: true,
    },
  ];

  return (
    <footer className="bg-[linear-gradient(130deg,#d8492f_0%,#a03f51_42%,#5c4a77_70%,#0c447c_100%)] text-white">
      <Container>
        <div className="foot-inner">
          <div className="foot-brand">
            <Link
              href="/"
              className="logo flex shrink-0 items-center gap-2.5 font-disp text-[21px] font-bold leading-none transition-opacity duration-200 hover:opacity-90"
            >
              <BrandMark variant="white" />
              <span>{name}</span>
            </Link>
            <p>{description}</p>
          </div>

          <div className="foot-col">
            <h4>Contacto</h4>
            {FOOTER_CONTACTS.map((contact) => {
              const Icon = contact.icon;
              return (
                <a
                  key={contact.label}
                  className="foot-contact"
                  href={contact.href}
                  target={contact.external ? "_blank" : undefined}
                  rel={contact.external ? "noopener" : undefined}
                >
                  <span className="foot-contact-icon">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="foot-contact-text">
                    <span className="foot-contact-label">{contact.label}</span>
                    {contact.value}
                  </span>
                </a>
              );
            })}
          </div>

          <div className="foot-col">
            <h4>Redes</h4>
            <div className="foot-socials">
              {FOOTER_SOCIALS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="bottom-bar">
          <span>© {new Date().getFullYear()} {name}</span>
          <span>Hecho con cariño para regalar</span>
        </div>
      </Container>
    </footer>
  );
}