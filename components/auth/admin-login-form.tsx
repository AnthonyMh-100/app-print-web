"use client";

import { useEffect, useRef } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import {
  IoAtOutline,
  IoLockClosedOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import { ownerLoginWithCredentials } from "@/actions/action-auth";
import { BrandMark } from "@/components/header/brand-mark";
import { InputField } from "@/components/auth/input-field";
import { PasswordInput } from "@/components/auth/password-input";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";

interface AdminLoginFormProps {
  showDefaultHint: boolean;
}

type AdminLoginState =
  | { success: false; errors: Record<string, string> }
  | { success: true };

const INITIAL_STATE: AdminLoginState = { success: false, errors: {} };

export function AdminLoginForm({ showDefaultHint }: AdminLoginFormProps) {
  const [state, formAction, isPending] = useActionState(
    ownerLoginWithCredentials,
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

    showToast("success", "Sesión iniciada correctamente");
    router.push("/admin");
    router.refresh();
  }, [state.success, showToast, router]);

  const errors = state.success ? null : state.errors;

  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-95 rounded-3xl border border-line bg-paper p-8 shadow-[0_24px_60px_rgba(33,42,58,0.12)]">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e6f1fb] text-blue-deep">
            <IoShieldCheckmarkOutline className="h-7 w-7" aria-hidden="true" />
          </span>
          <div className="mt-4 flex items-center gap-2.5">
            <BrandMark size={30} />
            <h1 className="font-disp text-[21px] font-bold leading-tight text-ink">
              Panel de administración
            </h1>
          </div>
          <p className="mt-1.5 text-[13px] text-muted">
            Acceso exclusivo para el dueño del negocio
          </p>
        </div>

        {showDefaultHint && (
          <p className="mt-5 rounded-xl border border-honey/40 bg-honey/10 px-4 py-3 text-[12.5px] leading-relaxed text-[#854f0b]">
            <strong className="font-semibold">Primer acceso:</strong> usa{" "}
            <code className="rounded bg-paper px-1 py-0.5 font-mono text-[12px]">
              admin@papiro.pe
            </code>{" "}
            con la contraseña{" "}
            <code className="rounded bg-paper px-1 py-0.5 font-mono text-[12px]">
              admin123
            </code>{" "}
            y cámbiala en Configuración.
          </p>
        )}

        <form action={formAction} noValidate className="mt-6 grid gap-3.5">
          <InputField
            id="admin-email"
            name="email"
            label="Correo del dueño"
            placeholder="tucorreo@negocio.pe"
            type="email"
            autoComplete="email"
            icon={<IoAtOutline size={17} aria-hidden="true" />}
            error={errors?.email}
            required
          />
          <PasswordInput
            id="admin-password"
            name="password"
            label="Contraseña"
            placeholder="Tu contraseña"
            autoComplete="current-password"
            icon={<IoLockClosedOutline size={17} aria-hidden="true" />}
            error={errors?.password}
            required
          />
          {errors?.root && (
            <p
              role="alert"
              className="rounded-lg border border-coral/30 bg-coral/10 px-3 py-2 text-[13px] font-medium text-coral-deep"
            >
              {errors.root}
            </p>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="mt-1 flex w-full items-center justify-center gap-2 rounded-full bg-blue py-3 text-[14px] font-semibold text-white transition-colors duration-200 hover:bg-blue-deep disabled:cursor-wait disabled:opacity-75"
          >
            {isPending && <Spinner className="h-4.5 w-4.5" />}
            Ingresar al panel
          </button>
        </form>

        <p className="mt-5 text-center text-[12px] text-muted">
          Este acceso es solo para administrar el negocio. Los clientes inician
          sesión desde la tienda.
        </p>
      </div>
    </main>
  );
}