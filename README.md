# Creaciones Papiro — Tienda online de regalos personalizados

Tienda web para el negocio **Creaciones Papiro**: un catálogo de productos personalizables (tazas, textiles, cristales, entre otros), con carrito de compras, pedidos por Yape y un panel de administración donde el dueño gestiona todo sin depender de nadie más.

## De qué va el proyecto

Es una aplicación full-stack en **Next.js (App Router)** con base de datos **PostgreSQL**. Tiene dos caras claramente separadas:

- **La tienda** (pública): el cliente navega el catálogo, filtra por categoría y precio, busca productos, los agrega al carrito, hace su pedido y paga escaneando un QR de Yape. Las tarjetas de producto incluyen un lightbox de imágenes con animaciones.
- **El panel del dueño** (privado): acceso por `/admin`. Ahí el dueño administra productos (con subida de imágenes a Cloudinary), categorías, pedidos (cambia estados, confirma pagos, descuenta stock automáticamente) y la configuración del negocio (datos de contacto, Yape, contraseña).

La idea detrás del diseño es que el negocio se administre **desde la misma página** que ve el cliente: no hace falta otra herramienta externa para gestionar el catálogo o los pedidos.

## Stack técnico

| Pieza | Herramienta |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19) |
| Base de datos | PostgreSQL vía Prisma ORM 7 |
| Autenticación | NextAuth v5 (Google para clientes, credenciales para el dueño) |
| Imágenes | Cloudinary (`next-cloudinary`) |
| Animaciones | Motion (Framer Motion) |
| Estado de UI | Zustand (carrito) |
| Validación | Zod |
| Estilos | Tailwind CSS 4 + CSS custom |
| Fechas | Moment.js |

## Modelo de datos principal

- **User** — clientes. Se registran con Google (o creados a mano). Siempre tienen rol `USER`.
- **Business** — una sola fila (`id = 1`) con los datos del negocio y las credenciales del dueño. No se siembra: **se crea sola en el primer acceso** mediante `bootstrapBusiness()`.
- **Category** — agrupa los productos.
- **Product** / **ProductImage** — cada producto tiene una o varias imágenes (la primera es la principal del catálogo).
- **Order** / **OrderItem** — pedidos con sus líneas. El stock se descuenta recién cuando el pago pasa a `PAID`.

## Cómo funciona el acceso del dueño

La fila del negocio se autogenera al primer uso (no hay seed ni pantalla de registro):

1. Al abrir `/admin/login`, `bootstrapBusiness()` crea la fila con las credenciales por defecto si no existe.
2. Credenciales iniciales: `admin@papiro.pe` / `admin123` (se pueden cambiar con la variable `OWNER_DEFAULT_PASSWORD`).
3. El login del dueño es por credenciales; el de los clientes, por Google. El panel solo admite a usuarios con `kind: "owner"`.
4. La contraseña se cambia desde `/admin/settings` (ahí también se editan nombre, WhatsApp, Yape, QR y otros datos).

## Puesta en marcha local

Requisitos: Node.js 20+, PostgreSQL local (o una instancia en Neon), cuentas de Google OAuth y Cloudinary.

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno (ver sección siguiente)
#    Copiar .env con los valores reales

# 3. Crear la base de datos y las tablas
npx prisma migrate dev

# 4. Generar el cliente de Prisma
npx prisma generate

# 5. Levantar el servidor
npm run dev
```

> Nota: este proyecto usa el driver adapter de Prisma (`@prisma/adapter-pg`), así que la migración usa el `DATABASE_URL` tal cual.

## Variables de entorno

```
DATABASE_URL=postgresql://usuario:clave@host:puerto/print_db?schema=public
AUTH_SECRET=<secreto generado>
AUTH_GOOGLE_ID=<id de cliente OAuth>
AUTH_GOOGLE_SECRET=<secreto de cliente OAuth>
API_KEY=<cloudinary api key>
API_SECRET=<cloudinary api secret>
CLOUD_NAME=<cloudinary cloud name>
# Opcional: contraseña inicial del dueño (si no se define, usa "admin123")
OWNER_DEFAULT_PASSWORD=
```

## Scripts

```bash
npm run dev     # servidor de desarrollo
npm run build   # build de producción
npm run start   # servidor de producción
npm run lint    # revisión de eslint
```

## Despliegue (Neon + Vercel)

El orden recomendado es preparar la base primero y luego subir la app.

1. **Neon**: crear el proyecto Postgres y copiar la connection string.
2. **Migrar la base**: desde local, apuntando `DATABASE_URL` a la de Neon:
   ```bash
   npx prisma migrate deploy
   ```
   Esto crea las tablas (incluida `business_settings`, que arranca vacía).
3. **Vercel**: importar el repositorio y cargar las mismas variables de entorno (`DATABASE_URL` de Neon, `AUTH_SECRET`, Google OAuth y Cloudinary).
4. **Primer acceso**: abrir `https://tudominio/admin/login` e ingresar con `admin@papiro.pe` / `admin123` (o la contraseña definida en `OWNER_DEFAULT_PASSWORD`). La fila del negocio se crea automáticamente en ese momento.

No hay que sembrar la base: el sistema se encarga de crear la configuración del negocio en el primer arranque.