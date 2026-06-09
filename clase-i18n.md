# Internacionalización (i18n) en Next.js

## ¿Qué es i18n?

**i18n** es la abreviatura de *internationalization* (hay 18 letras entre la "i" y la "n"). Se refiere al proceso de diseñar una aplicación para que pueda adaptarse a **múltiples idiomas y regiones** sin necesidad de cambiar el código fuente, solo los textos.

Conceptos clave:
- **i18n (Internationalization):** preparar la app para soportar múltiples idiomas.
- **L10n (Localization):** adaptar el contenido a un idioma o región específica (traducir textos, formatos de fecha, moneda, etc.).
- **Locale:** identificador de idioma/región, por ejemplo `es`, `en-US`, `pt-BR`.

---

## ¿Cuándo necesito i18n?

- Tu app va a ser usada por personas que hablan distintos idiomas.
- Necesitas mostrar textos, fechas o números en formatos distintos según la región.
- Quieres que el usuario elija el idioma de la interfaz.

---

## Enfoques comunes en Next.js

| Enfoque | Descripción | Cuándo usarlo |
|---|---|---|
| **Context + Estado** | Guardar el idioma en un Context de React | Apps sencillas, ideal para aprender |
| **Rutas dinámicas** (`/[lang]/...`) | El idioma va en la URL | Apps grandes, SEO importante |
| **Librería externa** (`next-intl`, `next-i18next`) | Solución completa con plurales, fechas, etc. | Producción con alta complejidad |

En esta clase usamos el **primer enfoque** porque es el más simple y directo de entender.

---

## Paso a paso: implementar i18n con Context

### Paso 1 — Crear los archivos de traducción

Crea la carpeta `src/locales/` y dentro el archivo `translations.ts`:

```ts
// src/locales/translations.ts
export const translations = {
  es: {
    title: "Lista de tareas",
    placeholder: "Nueva tarea...",
    addButton: "Agregar",
  },
  en: {
    title: "Todo List",
    placeholder: "New task...",
    addButton: "Add",
  },
  pt: {
    title: "Lista de tarefas",
    placeholder: "Nova tarefa...",
    addButton: "Adicionar",
  },
};

export type Language = keyof typeof translations;
export type Translations = typeof translations.es;
```

> **¿Por qué TypeScript aquí?**
> `keyof typeof translations` infiere automáticamente el tipo `"es" | "en" | "pt"`.
> `typeof translations.es` da el tipo exacto del objeto de traducciones para que el autocompletado funcione.

---

### Paso 2 — Crear el Context de idioma

Crea `src/context/i18nContext.tsx`:

```tsx
"use client";

import { createContext, useContext, useState } from "react";
import { translations, Language, Translations } from "@/locales/translations";

// 1. Definir la forma del contexto
type I18nContextProps = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations; // el objeto de traducciones del idioma activo
};

// 2. Crear el contexto
export const I18nContext = createContext<I18nContextProps>({} as I18nContextProps);

// 3. Hook personalizado para consumir el contexto fácilmente
export const useTranslation = () => useContext(I18nContext);

// 4. Provider: guarda el idioma en estado y calcula `t`
export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("es");

  const t = translations[language]; // selecciona las traducciones del idioma activo

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};
```

> **Conceptos usados:**
> - `createContext` + `useContext`: el patrón estándar de React para estado global.
> - `useState<Language>`: estado tipado con los idiomas permitidos.
> - `t = translations[language]`: cada vez que cambia `language`, `t` automáticamente apunta al objeto de traducciones correcto.

---

### Paso 3 — Envolver la app con el Provider

En `src/context/Provider.tsx` (o donde tengas tu árbol de providers):

```tsx
import { I18nProvider } from "./i18nContext";

export const Provider = ({ children }) => {
  return (
    <I18nProvider>
      {/* el resto de tus providers */}
      {children}
    </I18nProvider>
  );
};
```

> El Provider debe envolver toda la app (o al menos los componentes que necesitan traducciones) para que `useTranslation()` funcione en cualquier componente hijo.

---

### Paso 4 — Crear el selector de idioma

Crea `src/components/LanguageSelector.tsx`:

```tsx
"use client";

import { useTranslation } from "@/context/i18nContext";
import { Language } from "@/locales/translations";

export const LanguageSelector = () => {
  const { language, setLanguage } = useTranslation();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as Language)}
    >
      <option value="es">ES</option>
      <option value="en">EN</option>
      <option value="pt">PT</option>
    </select>
  );
};
```

> `e.target.value as Language` es un *type cast* de TypeScript: le decimos al compilador "confía en mí, este string es uno de los idiomas válidos".

---

### Paso 5 — Usar las traducciones en un componente

En cualquier componente de la app, llama al hook `useTranslation()` y usa el objeto `t`:

```tsx
"use client";

import { useTranslation } from "@/context/i18nContext";
import { LanguageSelector } from "@/components/LanguageSelector";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      <LanguageSelector />
      <h1>{t.title}</h1>
      <input placeholder={t.placeholder} />
      <button>{t.addButton}</button>
    </div>
  );
}
```

> Cada vez que el usuario cambia el idioma con el `<select>`, el estado en el Context se actualiza, React re-renderiza todos los componentes que consumen `useTranslation()`, y los textos cambian automáticamente.

---

## Flujo de datos

```
Usuario elige idioma
        ↓
LanguageSelector llama setLanguage("en")
        ↓
Estado `language` en I18nProvider cambia
        ↓
`t = translations["en"]` se recalcula
        ↓
React re-renderiza todos los componentes que usan useTranslation()
        ↓
Los textos aparecen en inglés
```

---

## Resumen de archivos creados

| Archivo | Responsabilidad |
|---|---|
| `src/locales/translations.ts` | Contiene todos los textos en cada idioma |
| `src/context/i18nContext.tsx` | Context, Provider y hook `useTranslation` |
| `src/components/LanguageSelector.tsx` | UI para cambiar el idioma |

---

## ¿Qué sigue?

Una vez dominado este enfoque básico, puedes explorar:

- **[next-intl](https://next-intl.dev/)** — librería popular para i18n en Next.js con soporte para plurales, fechas y rutas.
- **Rutas con locale** — el idioma en la URL (`/es/...`, `/en/...`) para mejor SEO.
- **`Intl` API del navegador** — para formatear fechas, números y monedas según el locale sin librerías externas.
