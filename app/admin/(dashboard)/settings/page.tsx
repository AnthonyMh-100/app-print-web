import { getBusiness } from "@/lib/business";
import { BusinessSettingsForm } from "@/components/admin/sections/business-settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const business = await getBusiness();

  return (
    <BusinessSettingsForm
      business={{
        name: business.name,
        tagline: business.tagline,
        ownerName: business.ownerName,
        email: business.email,
        phone: business.phone,
        address: business.address,
        yapeNumber: business.yapeNumber,
        yapeQrUrl: business.yapeQrUrl,
        telegramUser: business.telegramUser,
        footerNote: business.footerNote,
      }}
    />
  );
}