# =============================================================================
# Dockerfile para portal-video-practica (Vite + React SPA)
# =============================================================================
#
# Este proyecto es una SPA (Single Page Application) generada con Vite + React.
# El build produce una carpeta dist/ con archivos HTML, CSS y JS totalmente
# estaticos que cualquier servidor web puede servir directamente.
#
# Usamos un "multi-stage build" con dos etapas:
#
#   1. BUILD: Instalamos dependencias y compilamos el proyecto con "npm run build"
#      (que internamente ejecuta: tsr generate + tsc -b + vite build).
#      En esta etapa son necesarias las variables de entorno VITE_* porque Vite
#      las incrusta ("bake") directamente dentro del bundle JS en tiempo de build.
#      Una vez compiladas, esas variables NO son necesarias en runtime.
#
#   2. RUNTIME: Usamos nginx:alpine para servir los archivos estaticos de dist/.
#      nginx es mucho mas ligero que Node.js para servir estaticos y ademas
#      se encarga del routing SPA (redirigir todas las rutas desconocidas a
#      index.html para que React Router las gestione en el cliente).
#
# En el flujo de GitHub Actions:
#   - Los secretos VITE_* se inyectan como build-args en docker/build-push-action.
#   - La imagen resultante se publica en GitHub Container Registry (GHCR).
#   - Un deploy hook de Render arranca el nuevo contenedor automaticamente.
#
# =============================================================================

# -- ETAPA 1: BUILD ----------------------------------------------------------
# Usamos node:22-slim como base. La variante "slim" es mas ligera que la completa,
# suficiente para npm y el proceso de build.
FROM node:22-slim AS build

# Establecemos /app como directorio de trabajo dentro del contenedor.
WORKDIR /app

# Copiamos SOLO los ficheros de dependencias antes que el resto del codigo.
# Esto aprovecha la cache de capas de Docker: si package.json / package-lock.json
# no cambian, Docker reutiliza la capa de "npm ci" en builds locales sucesivos.
#
# NOTA: En GitHub Actions los runners son efimeros, por lo que no hay cache de
# capas por defecto. Para obtenerla habria que configurar cache-from/cache-to
# en docker/build-push-action apuntando a GHCR. Sin esa configuracion, cada
# build en CI reinstala dependencias desde cero.
COPY package.json package-lock.json ./

# Instalamos las dependencias de forma limpia y reproducible.
# "npm ci" es preferible a "npm install" en Docker porque:
#   - Borra node_modules y los reinstala desde cero.
#   - Usa las versiones exactas del package-lock.json (sin modificarlo).
#   - Es mas rapido y determinista.
RUN npm ci

# Copiamos el resto del codigo fuente DESPUES del npm ci, para que cambios
# en el codigo no invaliden la cache de la capa de dependencias.
COPY . .

# Declaramos los build args que recibe el build de Vite.
# Se pasan desde fuera con: docker build --build-arg VITE_X=xxx
# En GitHub Actions se inyectan automaticamente desde los secretos del repositorio
# a traves del parametro "build-args" de docker/build-push-action.
ARG VITE_CONTENT_ISLAND_TOKEN
ARG VITE_OPENROUTER_API_KEY

# Convertimos los build args en variables de entorno para que Vite pueda leerlos
# durante el proceso de build y los incruste en el bundle final.
# Al ser una SPA estatica, estas variables NO estaran presentes en runtime.
ENV VITE_CONTENT_ISLAND_TOKEN=${VITE_CONTENT_ISLAND_TOKEN}
ENV VITE_OPENROUTER_API_KEY=${VITE_OPENROUTER_API_KEY}

# Compilamos el proyecto. El script "build" de package.json ejecuta:
#   1. tsr generate  -> genera el arbol de rutas de TanStack Router (routeTree.gen.ts)
#   2. tsc -b        -> compila TypeScript y verifica tipos
#   3. vite build    -> empaqueta la app y genera la carpeta dist/
RUN npm run build

# -- ETAPA 2: RUNTIME --------------------------------------------------------
# Usamos nginx:alpine como servidor web para los archivos estaticos.
# Es extremadamente ligero (~5 MB) y no incluye nada del codigo fuente ni
# las herramientas de desarrollo de la etapa anterior.
FROM nginx:alpine AS runtime

# Copiamos la configuracion personalizada de nginx.
# Gestiona el routing SPA y la cache de assets estaticos.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos unicamente la carpeta dist/ generada en la etapa de build.
COPY --from=build /app/dist /usr/share/nginx/html

# Documentamos el puerto en el que escuchara nginx (definido en nginx.conf).
# Render detecta automaticamente este EXPOSE para configurar el health check.
EXPOSE 8080

# nginx arranca en foreground para que Docker pueda gestionar el proceso.
CMD ["nginx", "-g", "daemon off;"]
