# Autenticación y Autorización en Next.js con NextAuth

Guía paso a paso para implementar autenticación con **credenciales (email/password)**, **GitHub** y **Google** usando NextAuth.js en Next.js (App Router).

---

## Conceptos clave antes de empezar

| Concepto | Descripción |
|---|---|
| **Autenticación** | Verifica quién es el usuario (login) |
| **Autorización** | Define a qué puede acceder ese usuario |
| **JWT** | Token firmado que viaja entre cliente y servidor |
| **Session** | Estado de la sesión del usuario en la app |

### Métodos de autenticación disponibles

- **NextAuth.js** — solución todo-en-uno: OAuth, credenciales, JWT, callbacks personalizados
- **JWT puro** — genera y valida tokens en API Routes sin estado de servidor
- **OAuth** — login social con Google, GitHub, Facebook, etc.

### Métodos de autorización en Next.js

- **Middleware** — intercepta cada request antes de renderizar la página
- **Server Components / `getServerSideProps`** — verificación a nivel servidor
- **Roles y permisos** — restricción de acceso según rol del usuario (admin, user, etc.)

---

## Estructura de archivos que vamos a crear

```
app/
├── (auth)/
│   └── layout.tsx          ← AuthLayout con Navbar y SessionProvider
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts    ← Backend handler de NextAuth
├── dashboard/
│   └── page.tsx            ← Ruta protegida
├── login/
│   └── page.tsx            ← Página de login
├── layout.tsx              ← RootLayout
middleware.ts               ← Protección de rutas
.env.local                  ← Variables de entorno
```

---

## Paso 1 — Instalar dependencias

```bash
npm install next-auth
```

NextAuth.js maneja por nosotros: sesiones, cookies/JWT, OAuth flows y callbacks.

---

## Paso 2 — Variables de entorno

Crea el archivo `.env.local` en la raíz del proyecto:

```env
# Secreto para firmar los tokens JWT (genera uno con: openssl rand -base64 32)
NEXTAUTH_SECRET=tu_secreto_aqui

# URL base de la app
NEXTAUTH_URL=http://localhost:3000

# GitHub OAuth (obtenlo en github.com/settings/developers)
GITHUB_CLIENT_ID=tu_github_client_id
GITHUB_CLIENT_SECRET=tu_github_client_secret

# Google OAuth (obtenlo en console.cloud.google.com)
GOOGLE_CLIENT_ID=tu_google_client_id
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

### Cómo obtener las credenciales de Google

1. Ve a [console.cloud.google.com](https://console.cloud.google.com)
2. Crea un proyecto nuevo (o selecciona uno existente)
3. Ve a **APIs & Services → Credentials**
4. Clic en **Create Credentials → OAuth 2.0 Client IDs**
5. Tipo de aplicación: **Web application**
6. En **Authorized redirect URIs** agrega:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. Copia el **Client ID** y **Client Secret** a tu `.env.local`

### Cómo obtener las credenciales de GitHub

1. Ve a [github.com/settings/developers](https://github.com/settings/developers)
2. Clic en **New OAuth App**
3. **Homepage URL**: `http://localhost:3000`
4. **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
5. Copia el **Client ID** y genera un **Client Secret**

---

## Paso 3 — Backend route de NextAuth

Crea el archivo `app/api/auth/[...nextauth]/route.ts`. Este archivo es el **corazón** de la autenticación: define todos los proveedores y la lógica de sesión.

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    // ── Proveedor GitHub ──────────────────────────────────────
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    // ── Proveedor Google ──────────────────────────────────────
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ── Proveedor Credenciales (email + password) ─────────────
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Aquí va tu lógica real: consultar la base de datos, validar hash, etc.
        const user = await authenticateUser(
          credentials?.email,
          credentials?.password
        );

        if (user) {
          return { id: user.id, name: user.name, email: user.email };
        } else {
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],

  // ── Callbacks: personaliza token y sesión ─────────────────
  callbacks: {
    async jwt({ token, user }) {
      // Se ejecuta al crear o actualizar el token JWT
      if (user) {
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Se ejecuta al leer la sesión en el cliente
      if (token) {
        session.user.name = token.name as string;
        session.user.email = token.email as string;
      }
      return session;
    },
  },

  // ── Configuración general ─────────────────────────────────
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", // Usa JWT en lugar de sesiones por cookies de servidor
  },
  pages: {
    signIn: "/login",  // Redirige aquí si no está autenticado
    error: "/login",   // Redirige aquí si hay un error
  },
});

export { handler as GET, handler as POST };

// ── Función auxiliar de ejemplo ───────────────────────────────
// Reemplaza esto con tu lógica real de base de datos
async function authenticateUser(email?: string, password?: string) {
  // Ejemplo hardcodeado — en producción consulta tu BD y verifica el hash
  if (email === "user@example.com" && password === "password123") {
    return { id: "1", name: "Usuario Demo", email: "user@example.com" };
  }
  return null;
}
```

**¿Qué hace cada parte?**

| Parte | Función |
|---|---|
| `providers` | Lista los métodos de login disponibles |
| `callbacks.jwt` | Agrega datos extra al token cuando se crea |
| `callbacks.session` | Expone esos datos al cliente en el objeto `session` |
| `secret` | Firma criptográfica de los tokens |
| `strategy: "jwt"` | Sin base de datos de sesiones — el token viaja en cookie |
| `pages.signIn` | Ruta a la que redirige si el usuario no está autenticado |

---

## Paso 4 — RootLayout con SessionProvider

El `SessionProvider` hace que el estado de la sesión esté disponible en **toda la app** sin necesidad de prop-drilling.

```typescript
// app/layout.tsx
"use client";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import "./globals.css";

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
```

> **Nota:** `"use client"` es necesario porque `SessionProvider` usa contexto de React, que es una API del lado del cliente.

---

## Paso 5 — Middleware para proteger rutas

El middleware se ejecuta **antes** de que Next.js renderice cualquier página. Si el usuario no tiene token válido, lo redirige al login.

```typescript
// middleware.ts (a la misma altura que la carpeta app/)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Rutas que requieren autenticación
const protectedRoutes = ["/dashboard", "/admin"];

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  if (protectedRoutes.includes(pathname)) {
    if (!token) {
      // Sin token → redirige al login
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // Tiene token o la ruta no está protegida → continúa
  return NextResponse.next();
}

// En qué rutas se aplica el middleware
export const config = {
  matcher: ["/dashboard", "/admin"],
};
```

---

## Paso 6 — AuthLayout con Navbar

Crea un layout para las **rutas autenticadas**. Este wrappea el contenido con `SessionProvider` y un `Navbar` que muestra el estado de la sesión.

```typescript
// app/(auth)/layout.tsx
"use client";
import { SessionProvider, useSession, signOut } from "next-auth/react";
import { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface AuthLayoutProps {
  children: ReactNode;
}

function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <nav>
      <ul>
        {session ? (
          <>
            <li>Welcome, {session.user?.name}</li>
            <li>
              <button onClick={handleSignOut}>Sign out</button>
            </li>
          </>
        ) : (
          <li>
            <a href="/login">Login</a>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <SessionProvider>
      <Navbar />
      <main>{children}</main>
    </SessionProvider>
  );
}
```

---

## Paso 7 — Página de Login

La página de login maneja tres formas de autenticación: **email/password**, **GitHub** y **Google**.

```typescript
// app/login/page.tsx
"use client";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Si ya está autenticado, redirige al dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  const handleSignIn = async (provider?: string) => {
    if (provider) {
      // Login con OAuth (GitHub o Google)
      await signIn(provider);
    } else {
      // Login con credenciales
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        router.push("/dashboard");
      }
    }
  };

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="login-container">
      <h1>Login</h1>

      {status === "unauthenticated" && (
        <div>
          <p>Please sign in to continue</p>

          {/* Formulario email/password */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSignIn();
            }}
          >
            <div>
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit">Sign in with Email</button>
          </form>

          {/* Mensaje de error */}
          {error && <p style={{ color: "red" }}>{error}</p>}

          <hr />

          {/* Botones OAuth */}
          <button onClick={() => handleSignIn("github")}>
            Sign in with GitHub
          </button>
          <button onClick={() => handleSignIn("google")}>
            Sign in with Google
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Paso 8 — Ruta protegida: Dashboard

```typescript
// app/dashboard/page.tsx
"use client";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h1>Welcome to your dashboard!</h1>
      <p>Logged in as: {session?.user?.email}</p>
    </div>
  );
}
```

---

## Resumen del flujo completo

```
Usuario visita /dashboard
        ↓
middleware.ts intercepta el request
        ↓
¿Tiene token JWT válido?
   NO → Redirige a /login
   SÍ → Renderiza el dashboard
        ↓
En /login el usuario elige:
  [email/password] → signIn("credentials") → authorize() en route.ts
  [GitHub]         → signIn("github")      → OAuth flow de GitHub
  [Google]         → signIn("google")      → OAuth flow de Google
        ↓
NextAuth valida las credenciales / recibe el callback OAuth
        ↓
callbacks.jwt() → agrega datos al token
callbacks.session() → expone datos al cliente
        ↓
Usuario autenticado → redirige a /dashboard
        ↓
useSession() disponible en todos los componentes
```

---

## Errores comunes y cómo resolverlos

| Error | Causa | Solución |
|---|---|---|
| `NEXTAUTH_SECRET` no definido | Falta la variable de entorno | Agrégala a `.env.local` |
| Redirect loop en `/login` | El middleware también protege `/login` | Excluir `/login` del `matcher` |
| `useSession` retorna `null` | Falta `SessionProvider` en el árbol | Verifica que `RootLayout` lo incluye |
| OAuth callback error | URL de callback no registrada | Verificar que la URL en el provider coincida con `NEXTAUTH_URL/api/auth/callback/[provider]` |
| `Cannot read properties of undefined (reading 'email')` | Session no cargada aún | Verificar `status === "authenticated"` antes de leer `session.user` |

---

## Checklist de implementación

- [ ] `npm install next-auth`
- [ ] `.env.local` con `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, y credenciales de cada provider
- [ ] `app/api/auth/[...nextauth]/route.ts` con los providers deseados
- [ ] `app/layout.tsx` con `SessionProvider`
- [ ] `middleware.ts` con las rutas protegidas
- [ ] `app/(auth)/layout.tsx` con `Navbar` y estado de sesión
- [ ] `app/login/page.tsx` con botones de login
- [ ] Redirect URI registrada en Google Console y GitHub OAuth App

---

## Referencias

- Authentication in React Applications. (2019). React Documentation.
- Kefeng & Wang. (2020). Next.js Middleware and Route Protection.
- NextAuth.js Documentation. (2023). Authentication for the Web.
- Refai et al. (2020). JWT Refresh Token Rotation with NextAuth.js.
- Sheffer et al. (2020). How to Authenticate Users in Next.js With NextAuth.
- Edwin Arroyo. (2024). Ilustraciones y ejemplos de código — Implementación NextAuth.
