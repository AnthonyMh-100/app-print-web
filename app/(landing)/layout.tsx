import type { ReactNode } from "react";
import { auth } from "@/auth";
import { getBusiness } from "@/lib/business";
import { Header } from "@/components/header/header";
import { Footer } from "@/components/sections/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

export default async function LandingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  const user = session?.user ?? null;
  const business = await getBusiness();

  return (
    <>
      <Header user={user} brandName={business.name} />
      {children}
      <Footer />
      <CartDrawer />
    </>
  );
}
