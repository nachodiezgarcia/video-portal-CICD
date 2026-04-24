# =============================================================================
# Dockerfile para portal-video-practica (Vite + React SPA)
# =============================================================================
#
# Este Dockerfile es solo la etapa de RUNTIME: asume que la SPA ya ha sido
# compilada por GitHub Actions (steps "Install dependencies" + "Build" del
# workflow cd.yml), y que la carpeta dist/ esta presente en el contexto de
# build cuando se ejecuta "docker build".
#
# El flujo completo de CD es:
#   1. GitHub Actions: npm ci  (instala dependencias)
#   2. GitHub Actions: vite build  (genera dist/ con las VITE_* vars incrustadas)
#   3. GitHub Actions: docker build + push  (empaqueta dist/ en imagen nginx)
#   4. Render: arranca el contenedor desde GHCR
#
# Usar nginx:alpine para servir los estaticos es mucho mas ligero que Node.js
# (~5 MB vs ~180 MB) y ademas gestiona el routing SPA (redirige rutas
# desconocidas a index.html para que React Router las maneje en el cliente).
# =============================================================================

FROM nginx:alpine

# Configuracion personalizada de nginx: routing SPA + cache de assets.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos el bundle ya compilado por GitHub Actions.
COPY dist /usr/share/nginx/html

# Render detecta automaticamente este EXPOSE para configurar el health check.
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
