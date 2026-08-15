"use client";

import { useState } from "react";
import { IoQrCodeOutline } from "react-icons/io5";
import { getPublicBusinessData } from "@/actions/action-business";
import { YapeQrModal } from "./yape-qr-modal";
import type { YapeOrderInfo } from "./yape-qr-modal";

interface YapePayButtonProps {
  orderId: number;
  total: number;
}

export function YapePayButton({ orderId, total }: YapePayButtonProps) {
  const [orderInfo, setOrderInfo] = useState<YapeOrderInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const business = await getPublicBusinessData();
    setOrderInfo({
      id: orderId,
      total,
      qrSrc: business.yapeQrUrl || "/QR.jpeg",
      number: business.yapeNumber,
    });
    setIsLoading(false);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        disabled={isLoading}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-turquoise px-4 py-2 text-[12.5px] font-semibold text-white transition-colors duration-200 hover:bg-turquoise-deep disabled:cursor-wait disabled:opacity-75"
      >
        <IoQrCodeOutline className="h-4 w-4" aria-hidden="true" />
        Pagar con Yape
      </button>
      {orderInfo && <YapeQrModal order={orderInfo} onClose={() => setOrderInfo(null)} />}
    </>
  );
}