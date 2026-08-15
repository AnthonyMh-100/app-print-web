-- CreateTable
CREATE TABLE "business_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "name" TEXT NOT NULL DEFAULT 'Creaciones Papiro',
    "tagline" TEXT,
    "ownerName" TEXT,
    "email" TEXT NOT NULL DEFAULT 'admin@papiro.pe',
    "passwordHash" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "yapeNumber" TEXT,
    "yapeQrUrl" TEXT,
    "telegramUser" TEXT,
    "footerNote" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "business_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "business_settings_email_key" ON "business_settings"("email");
