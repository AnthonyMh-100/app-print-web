export const LOCALES = ["es", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const MESSAGES = {
  email_invalid: {
    es: "El correo no es válido",
    en: "Invalid email address",
  },
  password_short: {
    es: "La contraseña debe tener al menos 6 caracteres",
    en: "Password must have at least 6 characters",
  },
  name_short: {
    es: "El nombre debe tener al menos 2 caracteres",
    en: "Name must have at least 2 characters",
  },
  name_long: {
    es: "El nombre debe tener como máximo 50 caracteres",
    en: "Name must have at most 50 characters",
  },
  username_short: {
    es: "El usuario debe tener al menos 3 caracteres",
    en: "Username must have at least 3 characters",
  },
  username_long: {
    es: "El usuario debe tener como máximo 20 caracteres",
    en: "Username must have at most 20 characters",
  },
  username_invalid: {
    es: "Solo letras, números y guiones bajos",
    en: "Only letters, numbers and underscores",
  },
  username_exists: {
    es: "El usuario ya está registrado",
    en: "Username already taken",
  },
  email_exists: {
    es: "El correo ya está registrado",
    en: "Email already registered",
  },
  invalid_credentials: {
    es: "Usuario o contraseña incorrectos",
    en: "Invalid username or password",
  },
  current_password_invalid: {
    es: "La contraseña actual no es correcta",
    en: "Current password is incorrect",
  },
  settings_saved: {
    es: "Configuración guardada",
    en: "Settings saved",
  },
  field_too_long: {
    es: "El texto es demasiado largo",
    en: "Text is too long",
  },
  required: {
    es: "Campo obligatorio",
    en: "This field is required",
  },
  description_short: {
    es: "La descripción debe tener al menos 10 caracteres",
    en: "Description must have at least 10 characters",
  },
  description_long: {
    es: "La descripción no puede exceder 300 caracteres",
    en: "Description must have at most 300 characters",
  },
  slug_invalid: {
    es: "Solo letras minúsculas, números y guiones",
    en: "Only lowercase letters, numbers and dashes",
  },
  category_required: {
    es: "Selecciona una categoría",
    en: "Select a category",
  },
  price_invalid: {
    es: "Ingresa un precio válido",
    en: "Enter a valid price",
  },
  stock_invalid: {
    es: "Ingresa un stock válido",
    en: "Enter a valid stock",
  },
  image_invalid: {
    es: "Imagen no válida",
    en: "Invalid image",
  },
  images_max: {
    es: "Máximo 6 imágenes por producto",
    en: "Up to 6 images per product",
  },
  badge_required: {
    es: "Selecciona un color para el badge",
    en: "Select a badge color",
  },
  category_has_products: {
    es: "No se puede eliminar: la categoría tiene productos",
    en: "Cannot delete: category has products",
  },
  category_not_found: {
    es: "Categoría no encontrada",
    en: "Category not found",
  },
  register_success: {
    es: "¡Tu cuenta se creó correctamente!",
    en: "Your account was created successfully!",
  },
  login_success: {
    es: "¡Sesión iniciada correctamente!",
    en: "You are logged in!",
  },
  error_generic: {
    es: "Ocurrió un error inesperado. Inténtalo de nuevo.",
    en: "Something went wrong. Please try again.",
  },
} as const;

export type MessageKey = keyof typeof MESSAGES;

export function t(key: MessageKey, locale: Locale = "es"): string {
  return MESSAGES[key][locale];
}

export function translateMessage(
  message: string,
  locale: Locale = "es",
): string {
  if (message in MESSAGES) return MESSAGES[message as MessageKey][locale];

  return MESSAGES.required[locale];
}
