# Cómo añadir nuevos idiomas

Este documento describe el procedimiento para incorporar un nuevo idioma en la plataforma LP Tutor Web.

## 1. Registro del idioma en el sistema de tipos

Edita `src/lib/i18n/types.ts` y añade el código del nuevo idioma al tipo `Locale`:

```ts
export type Locale = "es" | "en" | "fr" | "de" | "ja" | "zh" | "it";  // Ejemplo: añadir "it" para italiano
```

## 2. Crear el archivo de traducciones

Crea un nuevo archivo JSON en `src/locales/` con el código del idioma, por ejemplo `de.json`.

**Estructura requerida:** El archivo debe tener exactamente la misma estructura de claves que `es.json`, `en.json` o `fr.json`. Puedes copiar uno de estos archivos como plantilla y traducir los valores.

```bash
cp src/locales/en.json src/locales/de.json
```

Luego edita `de.json` y traduce todos los valores de string. Conserva las claves sin cambiar y respeta las interpolaciones `{{param}}`:

```json
{
  "common": {
    "nav": {
      "graphical": "2D-Grafikmethode",
      "simplex": "Tabellarisches Simplex",
      "main": "Hauptmenü"
    },
    ...
  },
  ...
}
```

## 3. Registrar el archivo en el índice de i18n

Edita `src/lib/i18n/index.ts`:

1. Importa el nuevo archivo de traducciones:

```ts
import de from "@/locales/de.json";
```

2. Añade el idioma al objeto `translations`:

```ts
export const translations: Record<Locale, Translations> = {
  es: es as Translations,
  en: en as Translations,
  fr: fr as Translations,
  de: de as Translations,  // Nuevo idioma
};
```

## 4. Añadir el idioma al selector

Edita `src/components/LocaleSelector.tsx` y añade una entrada en el array `locales`:

```tsx
const locales: { value: Locale; label: string }[] = [
  { value: "es", label: "ES" },
  { value: "en", label: "EN" },
  { value: "fr", label: "FR" },
  { value: "de", label: "DE" },  // Nuevo idioma
];
```

## 5. Actualizar la función de detección del locale almacenado

En `src/lib/i18n/context.tsx`, la función `getStoredLocale()` debe aceptar el nuevo código. Busca la condición que valida el valor almacenado y añade el nuevo idioma:

```ts
function getStoredLocale(): Locale {
  if (typeof window === "undefined") return "es";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "es" || stored === "en" || stored === "fr" || stored === "de") return stored;
  return "es";
}
```

## 6. Actualizar el atributo `lang` del documento

En `src/components/LangSync.tsx`, añade el nuevo idioma al objeto `LANG_MAP` (usa códigos BCP 47 para SEO):

```tsx
const LANG_MAP: Record<Locale, string> = {
  es: "es",
  en: "en",
  fr: "fr",
  de: "de",
  ja: "ja",
  zh: "zh-Hans",
  it: "it",  // Nuevo idioma
};
```

## 7. Configurar SEO (hreflang y OpenGraph)

En `src/app/layout.tsx`, añade el nuevo idioma en:

1. **metadata.alternates.languages**: para las etiquetas hreflang que indican a los buscadores las versiones idiomáticas disponibles.
2. **metadata.openGraph.alternateLocale** (opcional): códigos en formato `xx_YY` (ej. `it_IT` para italiano).

## 8. Verificación

1. Ejecuta `npm run build` para comprobar que no hay errores de TypeScript.
2. Inicia la aplicación y verifica que el nuevo idioma aparece en el selector.
3. Cambia al nuevo idioma y revisa que todas las cadenas se muestran traducidas.
4. Comprueba que el idioma se persiste tras recargar la página (localStorage).

## Claves con interpolación

Algunas traducciones usan parámetros con la sintaxis `{{nombre}}`:

- `{{current}}`, `{{total}}` – ejemplo: "Paso 1 de 5"
- `{{i}}`, `{{n}}` – índices o números en mensajes de validación
- `{{max}}` – límite de iteraciones en advertencias
- `{{row}}`, `{{col}}`, `{{entering}}`, `{{leaving}}` – información de pivote

No modifiques el nombre de estos parámetros al traducir; solo cambia el texto alrededor.

## Fallback

Si una clave no existe en el nuevo idioma, el sistema usa la traducción en español (`es`) como fallback. Es recomendable completar todas las claves para evitar textos mixtos.
