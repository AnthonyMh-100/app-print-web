"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  IoBuildOutline,
  IoCardOutline,
  IoLockClosedOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { updateBusinessSettings } from "@/actions/action-business";
import { PageHeader } from "../ui/page-header";
import { Card } from "../ui/card";
import { InputField } from "@/components/auth/input-field";
import { PasswordInput } from "@/components/auth/password-input";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/utils/cn";

interface BusinessSettingsFormProps {
  business: {
    name: string;
    tagline: string | null;
    ownerName: string | null;
    email: string;
    phone: string | null;
    address: string | null;
    yapeNumber: string | null;
    yapeQrUrl: string | null;
    telegramUser: string | null;
    footerNote: string | null;
  };
}

type SettingsState =
  | { success: false; errors: Record<string, string> }
  | { success: true };

const INITIAL_STATE: SettingsState = { success: false, errors: {} };

function SectionCard({
  icon,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-3 border-b border-line pb-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e6f1fb] text-blue-deep">
          {icon}
        </span>
        <div>
          <h2 className="font-disp text-[16px] font-bold text-ink">{title}</h2>
          <p className="text-[12.5px] text-muted">{description}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </Card>
  );
}

export function BusinessSettingsForm({ business }: BusinessSettingsFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateBusinessSettings,
    INITIAL_STATE,
  );
  const notifiedRef = useRef(false);
  const { showToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!state.success) {
      notifiedRef.current = false;
      return;
    }

    if (notifiedRef.current) return;
    notifiedRef.current = true;

    showToast("success", "Configuración guardada");
    router.refresh();
  }, [state.success, showToast, router]);

  const errors = state.success ? null : state.errors;

  return (
    <div>
      <PageHeader
        title="Configuración"
        description="Datos del negocio y perfil del dueño"
      />

      <form action={formAction} noValidate className="grid gap-5">
        <SectionCard
          icon={<IoBuildOutline className="h-5 w-5" aria-hidden="true" />}
          title="Datos del negocio"
          description="Nombre, descripción y contacto que se muestran en la tienda."
        >
          <InputField
            id="business-name"
            name="name"
            label="Nombre del negocio"
            placeholder="Creaciones Papiro"
            defaultValue={business.name}
            error={errors?.name}
            required
          />
          <InputField
            id="business-tagline"
            name="tagline"
            label="Eslogan"
            placeholder="Regalos personalizados…"
            defaultValue={business.tagline ?? ""}
            error={errors?.tagline}
          />
          <InputField
            id="business-phone"
            name="phone"
            label="Teléfono"
            placeholder="+51 999 999 999"
            defaultValue={business.phone ?? ""}
            error={errors?.phone}
          />
          <InputField
            id="business-address"
            name="address"
            label="Dirección"
            placeholder="Dirección del local"
            defaultValue={business.address ?? ""}
            error={errors?.address}
          />
          <InputField
            id="business-telegram"
            name="telegramUser"
            label="Usuario de Telegram"
            placeholder="@tunegocio"
            defaultValue={business.telegramUser ?? ""}
            error={errors?.telegramUser}
          />
          <div className="field sm:col-span-2">
            <label htmlFor="business-footerNote">Nota del pie de página</label>
            <textarea
              id="business-footerNote"
              name="footerNote"
              placeholder="Mensaje breve que aparece al final de la tienda"
              defaultValue={business.footerNote ?? ""}
              aria-invalid={errors?.footerNote ? true : undefined}
              aria-describedby={
                errors?.footerNote ? "business-footerNote-error" : undefined
              }
            />
            {errors?.footerNote && (
              <span
                id="business-footerNote-error"
                className="field-error"
                role="alert"
              >
                {errors.footerNote}
              </span>
            )}
          </div>
        </SectionCard>

        <SectionCard
          icon={<IoCardOutline className="h-5 w-5" aria-hidden="true" />}
          title="Pago — Yape"
          description="Los datos que se muestran al cliente al pagar un pedido."
        >
          <InputField
            id="business-yapeNumber"
            name="yapeNumber"
            label="Número Yape"
            placeholder="999 999 999"
            defaultValue={business.yapeNumber ?? ""}
            error={errors?.yapeNumber}
          />
          <InputField
            id="business-yapeQrUrl"
            name="yapeQrUrl"
            label="URL del código QR"
            placeholder="/QR.jpeg"
            defaultValue={business.yapeQrUrl ?? ""}
            error={errors?.yapeQrUrl}
          />
        </SectionCard>

        <SectionCard
          icon={<IoPersonOutline className="h-5 w-5" aria-hidden="true" />}
          title="Perfil del dueño"
          description="Cómo te identificas en el panel y correo para iniciar sesión."
        >
          <InputField
            id="business-ownerName"
            name="ownerName"
            label="Nombre del dueño"
            placeholder="Tu nombre"
            defaultValue={business.ownerName ?? ""}
            error={errors?.ownerName}
          />
          <InputField
            id="business-email"
            name="email"
            label="Correo de acceso"
            placeholder="tucorreo@negocio.pe"
            type="email"
            autoComplete="email"
            defaultValue={business.email}
            error={errors?.email}
            required
          />
        </SectionCard>

        <SectionCard
          icon={<IoLockClosedOutline className="h-5 w-5" aria-hidden="true" />}
          title="Cambiar contraseña"
          description="Opcional. Solo llena estos campos si vas a cambiar tu contraseña de acceso."
        >
          <PasswordInput
            id="business-currentPassword"
            name="currentPassword"
            label="Contraseña actual"
            placeholder="Tu contraseña actual"
            autoComplete="current-password"
            error={errors?.currentPassword}
          />
          <PasswordInput
            id="business-newPassword"
            name="newPassword"
            label="Nueva contraseña"
            placeholder="Mínimo 6 caracteres"
            autoComplete="new-password"
            error={errors?.newPassword}
            minLength={6}
          />
        </SectionCard>

        {errors?.root && (
          <p
            role="alert"
            className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-[13px] font-medium text-coral-deep"
          >
            {errors.root}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isPending}
            className={cn(
              "inline-flex items-center gap-2 rounded-full bg-blue px-6 py-2.5 text-[13.5px] font-semibold text-white transition-colors duration-200 hover:bg-blue-deep",
              isPending && "cursor-wait opacity-75",
            )}
          >
            {isPending && <Spinner className="h-4 w-4" />}
            Guardar cambios
          </button>
        </div>
      </form>
    </div>
  );
}