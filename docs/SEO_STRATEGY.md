# Estrategia SEO multilingüe — LP Tutor

Objetivo: posicionar en búsquedas como "programación lineal", "calculadora programación lineal", "simplex calculator", etc. en **todos los idiomas** soportados (es, en, fr, de, ja, zh).

---

## 1. Diagnóstico actual

| Aspecto | Estado actual | Problema |
|---------|---------------|----------|
| **URLs** | `/`, `/simplex`, `/graphical` | Una sola URL por página; no hay versiones por idioma |
| **hreflang** | Apunta a la **misma URL** para todos los idiomas | Incorrecto: Google necesita URLs distintas por idioma |
| **Contenido indexable** | Client-side i18n | El HTML inicial (SSR) está en español; crawlers no ven contenido en otros idiomas |
| **Sitemap** | 3 URLs sin idioma | No declara versiones por idioma |
| **Contenido largo** | Escaso | Poco texto rico para long-tail; la app es interactiva, no artículos |

**Conclusión**: Para SEO “de verdad” multilingüe hay que pasar a **URLs por idioma** y **SSR con contenido en el idioma correcto** por ruta.

---

## 2. Arquitectura objetivo: rutas con locale

### 2.1 Estructura de URLs

```
/[locale]/           → Home (es, en, fr, de, ja, zh)
/[locale]/simplex    → Módulo Simplex
/[locale]/graphical  → Módulo gráfico
```

Ejemplos:
- `https://site.com/es/` — versión española
- `https://site.com/en/simplex` — Simplex en inglés
- `https://site.com/zh/graphical` — Método gráfico en chino

### 2.2 Implementación técnica (Next.js App Router)

- Carpeta `app/[locale]/` con `layout.tsx` que recibe `params.locale`
- Middleware o `generateStaticParams` para validar locale y redirigir
- Redirect de `/` → `/es/` (o al idioma detectado por `Accept-Language`)
- Metadata y JSON-LD generados dinámicamente según `locale`

### 2.3 hreflang correcto

Cada página declara sus alternativas:

```html
<link rel="alternate" hreflang="es" href="https://site.com/es/simplex" />
<link rel="alternate" hreflang="en" href="https://site.com/en/simplex" />
<link rel="alternate" hreflang="fr" href="https://site.com/fr/simplex" />
<link rel="alternate" hreflang="de" href="https://site.com/de/simplex" />
<link rel="alternate" hreflang="ja" href="https://site.com/ja/simplex" />
<link rel="alternate" hreflang="zh-Hans" href="https://site.com/zh/simplex" />
<link rel="alternate" hreflang="x-default" href="https://site.com/es/simplex" />
```

---

## 3. Palabras clave por idioma

### 3.1 Español (ES)
| Tipo | Términos |
|------|----------|
| **Head** | programación lineal, método simplex, método gráfico |
| **Mid** | calculadora programación lineal, simplex paso a paso, resolver programación lineal, tabla simplex |
| **Long-tail** | calculadora simplex online gratis, ejercicios programación lineal resueltos, método simplex explicado paso a paso, región factible programación lineal |

### 3.2 Inglés (EN)
| Tipo | Términos |
|------|----------|
| **Head** | linear programming, simplex method, graphical method |
| **Mid** | linear programming calculator, simplex calculator, LP solver |
| **Long-tail** | simplex method step by step calculator, linear programming solver free online, graphical method linear programming two variables |

### 3.3 Francés (FR)
| Tipo | Términos |
|------|----------|
| **Head** | programmation linéaire, méthode du simplexe |
| **Mid** | calculatrice programmation linéaire, solveur simplex |
| **Long-tail** | méthode du simplexe pas à pas, résoudre programmation linéaire en ligne |

### 3.4 Alemán (DE)
| Tipo | Términos |
|------|----------|
| **Head** | Lineare Optimierung, Simplex-Verfahren |
| **Mid** | Lineare Programmierung Rechner, Simplex Rechner |
| **Long-tail** | Simplex-Methode Schritt für Schritt, lineare Optimierung online lösen |

### 3.5 Japonés (JA)
| Tipo | Términos |
|------|----------|
| **Head** | 線形計画法, シンプレックス法 |
| **Mid** | 線形計画法 計算, シンプレックス法 計算機 |
| **Long-tail** | 線形計画法 無料 オンライン, シンプレックス法 手順 |

### 3.6 Chino simplificado (ZH)
| Tipo | Términos |
|------|----------|
| **Head** | 线性规划, 单纯形法 |
| **Mid** | 线性规划计算器, 单纯形法计算器 |
| **Long-tail** | 线性规划在线求解, 单纯形法步骤 |

---

## 4. Optimización on-page por página

### 4.1 Home (`/[locale]/`)

- **Título**: `{keyword principal} | Calculadora gratuita paso a paso` (traducido por locale)
- **Meta description**: 150–160 caracteres, incluir "calculadora", "programación lineal", "simplex", "método gráfico", CTA
- **H1**: Palabra clave principal (ej. "Calculadora de programación lineal")
- **Contenido**: Párrafo de 150–250 palabras con keywords naturales:
  - Qué es la programación lineal
  - Qué hace la calculadora
  - Enlaces a Simplex y método gráfico
  - Frases tipo "resolver problemas de optimización", "paso a paso"

### 4.2 Simplex (`/[locale]/simplex`)

- **Título**: `Método Simplex paso a paso | Calculadora online` (traducido)
- **Meta description**: Incluir "simplex", "Big-M", "tableau", "pivoteo"
- **H1**: Nombre del método en el idioma
- **Contenido**: 100–200 palabras sobre algoritmo Simplex, variables de holgura, Big-M, tableau

### 4.3 Gráfico (`/[locale]/graphical`)

- **Título**: `Método gráfico 2D | Región factible y óptimo` (traducido)
- **Meta description**: Incluir "método gráfico", "región factible", "vértices"
- **H1**: Nombre del método
- **Contenido**: 100–200 palabras sobre semiplanos, región factible, evaluación en vértices

---

## 5. Contenido rico (landing SEO)

Para long-tail y autoridad, añadir **bloques de texto visible** (no solo UI):

- **Home**: Sección "¿Qué es la programación lineal?" (2–3 párrafos)
- **Simplex**: Sección "¿Cómo funciona el método Simplex?" (resumen del algoritmo)
- **Gráfico**: Sección "¿Cómo se resuelve gráficamente?" (semiplanos, región factible)

Este contenido debe:
- Estar en el HTML inicial (SSR), no solo en client
- Usar `<article>`, `<section>`, `<h2>`, `<p>` con semántica correcta
- Incluir keywords de forma natural

---

## 6. Schema.org multilingüe

- **LearningResource**: `inLanguage` según locale (es, en, fr, de, ja, zh)
- **WebApplication**: `name` y `description` en el idioma de la página
- **BreadcrumbList**: Ya existe; asegurar que los `name` vienen de traducciones
- **FAQPage** (Simplex): preguntas y respuestas en el idioma de la página

---

## 7. Sitemap y robots

### Sitemap

- Una entrada **por URL por idioma**:

```
https://site.com/es/
https://site.com/es/simplex
https://site.com/es/graphical
https://site.com/en/
https://site.com/en/simplex
...
```

- `lastmod`, `changefreq`, `priority` por página
- `xhtml:link` con hreflang en cada URL (opcional pero recomendado)

### Robots

- `allow` para `/[locale]/`
- Sitemap único con todas las URLs

---

## 8. Plan de implementación (orden sugerido)

| Fase | Tareas | Esfuerzo |
|------|--------|----------|
| **1. Estructura** | Migrar a `app/[locale]/`, redirect `/` → `/es/`, middleware locale | Medio |
| **2. Metadata** | `generateMetadata` por ruta con traducciones, hreflang correcto | Medio |
| **3. Contenido** | Bloques SEO en home, simplex, graphical (texto rico por idioma) | Medio |
| **4. Schema** | JSON-LD con `inLanguage` y textos traducidos | Bajo |
| **5. Sitemap** | Sitemap dinámico con todas las URLs por locale | Bajo |
| **6. Keywords** | Revisar títulos/descriptions con listas de la sección 3 | Bajo |

---

## 9. Medición

- **Google Search Console**: Añadir propiedad, enviar sitemap, revisar impresiones/clics por query
- **Keywords a vigilar**: "programación lineal", "calculadora programación lineal", "simplex calculator", etc.
- **Segmentar por país/idioma** en GSC para ver rendimiento por locale

---

## 10. Limitaciones y alternativas

- **Tiempo de indexación**: Nuevas URLs pueden tardar semanas en rankear.
- **Competencia**: Términos como "programación lineal" tienen competencia alta; long-tail será más realista al inicio.
- **Alternativa sin migrar URLs**: Mantener URLs actuales y usar **páginas de aterrizaje estáticas** por idioma (`/es/landing`, `/en/landing`) con contenido rico + enlaces a la app. Menos limpio, pero más rápido de implementar.

---

## Resumen ejecutivo

1. **Cambiar arquitectura** a `/[locale]/` para que cada idioma tenga su URL.
2. **Metadata y hreflang** correctos por idioma.
3. **Añadir contenido textual** indexable en home, simplex y gráfico.
4. **Schema.org** y sitemap con todas las versiones idiomáticas.
5. **Seguimiento** en Search Console por query e idioma.

Con esto se sientan las bases para competir en búsquedas de "programación lineal" y variantes en los seis idiomas soportados.
