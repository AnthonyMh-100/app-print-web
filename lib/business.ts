import { cache } from "react";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import {
  DEFAULT_BUSINESS_NAME,
  DEFAULT_OWNER_EMAIL,
  DEFAULT_OWNER_PASSWORD,
} from "@/constants/business";

export interface BusinessSnapshot {
  id: number;
  name: string;
  tagline: string | null;
  ownerName: string | null;
  email: string;
  passwordHash: string | null;
  phone: string | null;
  address: string | null;
  yapeNumber: string | null;
  yapeQrUrl: string | null;
  telegramUser: string | null;
  footerNote: string | null;
  updatedAt: Date;
}

export interface BusinessBootstrapResult {
  business: BusinessSnapshot;
  created: boolean;
}

async function bootstrapBusinessInternal(): Promise<BusinessBootstrapResult> {
  const existing = await prisma.business.findUnique({ where: { id: 1 } });

  if (existing) {
    return { business: existing, created: false };
  }

  const passwordHash = await hashPassword(DEFAULT_OWNER_PASSWORD);

  const business = await prisma.business.create({
    data: {
      id: 1,
      name: DEFAULT_BUSINESS_NAME,
      email: DEFAULT_OWNER_EMAIL,
      passwordHash,
    },
  });

  return { business, created: true };
}

export const bootstrapBusiness = cache(bootstrapBusinessInternal);

export const getBusiness = cache(async (): Promise<BusinessSnapshot> => {
  const { business } = await bootstrapBusiness();
  return business;
});

export interface PublicBusiness {
  name: string;
  ownerName: string | null;
  yapeNumber: string | null;
  yapeQrUrl: string | null;
  telegramUser: string | null;
}

export const getPublicBusiness = cache(
  async (): Promise<PublicBusiness> => {
    const business = await getBusiness();
    return {
      name: business.name,
      ownerName: business.ownerName,
      yapeNumber: business.yapeNumber,
      yapeQrUrl: business.yapeQrUrl,
      telegramUser: business.telegramUser,
    };
  },
);