# Publicar la plataforma (LP Tutor) en internet

Tu app Next.js está lista para desplegarse. La opción más sencilla y gratuita es **Vercel** (creadores de Next.js).

---

## Opción recomendada: Vercel (gratis)

1. **Sube el proyecto a GitHub** (si aún no está):
   - Crea un repositorio en [github.com](https://github.com/new).
   - En la carpeta del proyecto (`lp-tutor-web`), ejecuta:
     ```bash
     git init
     git add .
     git commit -m "LP Tutor - listo para publicar"
     git branch -M main
     git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
     git push -u origin main
     ```

2. **Despliega en Vercel**:
   - Entra en [vercel.com](https://vercel.com) e inicia sesión (con GitHub).
   - Clic en **“Add New…” → “Project”**.
   - Importa el repositorio de `lp-tutor-web`.
   - **Root Directory**: si el repo es solo este proyecto, deja el valor por defecto. Si el repo contiene varias carpetas, pon `lp-tutor-web`.
   - **Build Command**: `npm run build` (por defecto).
   - **Output Directory**: dejar por defecto (Vercel lo detecta para Next.js).
   - (Opcional) En **Environment Variables** añade:
     - `NEXT_PUBLIC_SITE_URL` = `https://tu-proyecto.vercel.app` (lo puedes ajustar después de ver la URL que te den).
   - Clic en **Deploy**.

3. **Resultado**:
   - En 1–2 minutos tendrás una URL pública, por ejemplo:  
     `https://lp-tutor-web-xxxx.vercel.app`
   - Cada `git push` a `main` generará un nuevo despliegue automático.

---

## Alternativa: Netlify

- [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project** (conecta GitHub).
- Build command: `npm run build`
- Publish directory: `.next` no se usa así en Netlify; elige **Next.js** en el asistente para que Netlify use su plugin de Next.js y los valores por defecto correctos.

---

## Antes de publicar (recomendado)

- **Probar el build en local**:
  ```bash
  cd lp-tutor-web
  npm install
  npm run build
  npm run start
  ```
  Abre `http://localhost:3000` y revisa que todo funcione.

- **Variable de entorno en producción** (opcional pero útil para SEO y enlaces):
  - En Vercel: **Project → Settings → Environment Variables**
  - Añade `NEXT_PUBLIC_SITE_URL` = `https://tu-url-final.vercel.app`

Cuando tengas la URL de Vercel (o Netlify), ya puedes compartirla para que cualquiera use la calculadora de programación lineal en línea.
