"use client";

import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  IoAtOutline,
  IoClose,
  IoLockClosedOutline,
  IoLogoGoogle,
  IoMailOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { useRouter } from "next/navigation";
import {
  loginWithCredentials,
  loginWithGoogle,
  registerWithCredentials,
} from "@/actions/action-auth";
import { AUTH, LOGIN, REGISTER } from "@/constants/auth";
import { EASE } from "@/constants/motion";
import { t } from "@/constants/messages";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/utils/cn";
import { InputField } from "./input-field";
import { PasswordInput } from "./password-input";

type AuthMode = "login" | "register";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AuthFormState {
  success: false;
  errors: Record<string, string>;
}

const MODAL_TRANSITION = { duration: 0.25, ease: EASE };

const INITIAL_STATE: AuthFormState = { success: false, errors: {} };

const emptySubscribe = () => () => {};

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [mode, setMode] = useState<AuthMode>("login");
  const shouldReduce = useReducedMotion();

  const close = useCallback(() => {
    setMode("login");
    onClose();
  }, [onClose]);

  const switchMode = useCallback(() => {
    setMode((current) => (current === "login" ? "register" : "login"));
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, close]);

  const copy = mode === "login" ? LOGIN : REGISTER;

  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-100 flex items-center justify-center bg-ink/55 p-5 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={MODAL_TRANSITION}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={copy.title}
            className="max-h-[88vh] w-full max-w-100 overflow-y-auto rounded-[26px] bg-paper p-7 shadow-[0_24px_60px_rgba(33,42,58,0.3)]"
            initial={
              shouldReduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              shouldReduce ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }
            }
            transition={MODAL_TRANSITION}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-disp text-[21px] font-bold">{copy.title}</h3>
              <button
                type="button"
                onClick={close}
                aria-label={AUTH.closeLabel}
                className="text-muted transition-colors duration-200 hover:text-ink"
              >
                <IoClose size={20} aria-hidden="true" />
              </button>
            </div>

            <p className="mb-5 mt-1 text-[13px] text-muted">
              {copy.description}
            </p>

            <AuthForm
              key={mode}
              mode={mode}
              onSwitchMode={switchMode}
              onClose={close}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function AuthForm({
  mode,
  onSwitchMode,
  onClose,
}: {
  mode: AuthMode;
  onSwitchMode: () => void;
  onClose: () => void;
}) {
  const [loginState, loginFormAction, loginPending] = useActionState(
    loginWithCredentials,
    INITIAL_STATE,
  );
  const [registerState, registerFormAction, registerPending] = useActionState(
    registerWithCredentials,
    INITIAL_STATE,
  );
  const [isGooglePending, setIsGooglePending] = useState(false);
  const notifiedRef = useRef(false);
  const { showToast } = useToast();
  const router = useRouter();

  const isLogin = mode === "login";
  const state = isLogin ? loginState : registerState;
  const formAction = isLogin ? loginFormAction : registerFormAction;
  const isPending = isLogin ? loginPending : registerPending;
  const errors = state.success ? null : state.errors;
  const copy = mode === "login" ? LOGIN : REGISTER;
  const busy = isPending || isGooglePending;

  useEffect(() => {
    if (!state.success) {
      notifiedRef.current = false;
      return;
    }

    if (notifiedRef.current) return;
    notifiedRef.current = true;

    if (mode === "login") {
      showToast("success", t("login_success"));
      onClose();

      if (window.location.pathname === "/") {
        router.refresh();
      } else {
        router.push("/");
      }
      return;
    }

    showToast("success", t("register_success"));
    onSwitchMode();
  }, [state.success, mode, showToast, router, onSwitchMode, onClose]);

  const handleGoogle = () => {
    setIsGooglePending(true);
    loginWithGoogle();
  };

  return (
    <>
      <form action={formAction} noValidate className="grid gap-3.5">
        {mode === "register" && (
          <InputField
            id="auth-name"
            name="name"
            label={REGISTER.nameLabel}
            placeholder={REGISTER.namePlaceholder}
            type="text"
            autoComplete="name"
            icon={<IoPersonOutline size={17} aria-hidden="true" />}
            error={errors?.name}
            required
          />
        )}
        <InputField
          id="auth-username"
          name="username"
          label={copy.usernameLabel}
          placeholder={copy.usernamePlaceholder}
          type="text"
          autoComplete="username"
          icon={<IoAtOutline size={17} aria-hidden="true" />}
          error={errors?.username}
          required
        />
        {mode === "register" && (
          <InputField
            id="auth-email"
            name="email"
            label={copy.emailLabel}
            placeholder={copy.emailPlaceholder}
            type="email"
            autoComplete="email"
            icon={<IoMailOutline size={17} aria-hidden="true" />}
            error={errors?.email}
            required
          />
        )}
        <PasswordInput
          id="auth-password"
          name="password"
          label={copy.passwordLabel}
          placeholder={copy.passwordPlaceholder}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          icon={<IoLockClosedOutline size={17} aria-hidden="true" />}
          error={errors?.password}
          minLength={6}
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
          disabled={busy}
          aria-label={AUTH.submitAria}
          className={cn(
            "btn btn-primary w-full justify-center",
            busy && "cursor-wait opacity-75",
          )}
        >
          {isPending && <Spinner className="h-4.5 w-4.5" />}
          {copy.submitLabel}
        </button>
      </form>

      <div
        className="my-4 flex items-center gap-3"
        role="separator"
        aria-label={AUTH.dividerLabel}
      >
        <span className="h-px flex-1 bg-line" />
        <span className="text-[12.5px] uppercase tracking-[0.06em] text-muted">
          {AUTH.dividerLabel}
        </span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={busy}
        aria-label={AUTH.googleLabel}
        className={cn(
          "btn btn-outline w-full justify-center",
          busy && "cursor-wait opacity-75",
        )}
      >
        {isGooglePending && <Spinner className="h-4.5 w-4.5" />}
        <IoLogoGoogle size={17} aria-hidden="true" />
        {AUTH.googleLabel}
      </button>

      <div className="mt-4 text-center text-[13.5px] text-muted">
        {copy.switchText}{" "}
        <button
          type="button"
          onClick={onSwitchMode}
          className="font-semibold text-blue-deep transition-colors duration-200 hover:text-blue"
        >
          {copy.switchLink}
        </button>
      </div>
    </>
  );
}
