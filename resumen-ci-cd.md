# Sumario

En este ejercicio he implementado un portal publico simple de cursos donde:

- El usuario puede ver una lista de cursos.
- El usuario puede ver el detalle de un curso, y visualizar la diferentes videolecciones del mismo.
- El usuario puede preguntar a ChatBot dudas sobre el curso, y el ChatBot le responde utilizando la información del curso (para esto he utilizado la API de OpenRouter, que es una alternativa a la API de OpenAI).

Para almacenar la información de cada curso, hemos utizado un Headless CMS (Content Island), esto nos lleva a tener que gestionar un secreto (api token) para poder acceder a la información de los cursos.

Para poder interactuar con el ChatBot, también tenemos que gestionar otro secreto (api token) para poder acceder a la API de OpenRouter.

# Flujo CI/CD

He implementado dos flujos:

- Un flujo de CI que se dispara al crear un pull request, y que se encarga de ejecutar:
  - Traerse el repositorio a una máquina ubuntu.
  - Instalar las dependencias.
  - Ejecutar linter (calidad de código)
  - Ejecutar los tests.
- Un Flujo de CD que se dispara al hacer merge a main, y que se encarga de ejecutar:
  - Traerse el repositorio a una máquina ubuntu.
  - Instalar las dependencias.
  - Construir la aplicación.
  - Desplegar la aplicación a un hosting (en este caso, Render(\*)).

(\*) Intenté crear cuenta de estudiante en Azure, me reconoció el centro de Jesus Marín, pero no me permitía crear la cuenta con el correo de `educaand`, de ahí que eligiera Render como alternativa.

# CI

El flunjo de CI lo puedes encontrar en el archivo `.github/workflows/ci.yml`, y se ejecuta cada vez que se crea un pull request. En este flujo se ejecutan los pasos mencionados anteriormente, y si alguno de ellos falla, el pull request no podrá ser mergeado a main.

Lo he documentado bastante, porque es fácil que uno vuelva a revisarlo semanas después y no recuerde exactamente qué hace cada paso, así que he intentado dejarlo lo más claro posible.

Cómo resumen lo que hace:

- En el tag `on` le indicamos bajo que condiciones se debe de disparar, en esta caso lo que en _pull_request_, esta parte es muy interesante ya que por ejemplo le podría indicar que se disparará cada vez que se hiciera un push a una rama que contenga la palabra `feature` por ejemplo, o que solo se disparaá si han habido cambios en una carpeta concreta, etc (esto es muy útil si por ejemplo trabajamos con un monorepo en el que tenemos backend, frontend y otras areas y queremos que se ejecuten flujos de CI diferentes dependiendo del área que se vea afectada por el cambio).

Ejemplos:

```yml
on:
push:
  branches:
    - "feature/**"
```

Nos podría servir para ejecutar un flujo de CI específico para las ramas que empiecen por `feature/`.

Otra opcíon sería tener CI específico para un backend

```yml
on:
push:
  paths:
    - "backend/**"
```

- Un tag muy interesante es el de `concurrency`, ya que por ejemplo en mi caso, se puede dar que modifique una entrada en el Headless CMS, se lanze un build, te des cuenta que hay que modificar otra cosa, y lo que quieres es que al lanzar el nuevo build se cancele el anteriro que está en progreso.

- Vamos aquí los jobs que son las tareas que se van a ejecutar, aquí tenemos un job _test_ en el que:
  - Le damos un nombre.
  - Le indicamos que se ejecute en una máquina con sistema operativo ubuntu (Github Actions tiene máquinas con diferentes sistemas operativos, en nuestro caso Ubuntu es buena opción, si fuera un repo privado tendría un coste relativo de 1x, Windows un coste relativo de 2x, y MacOs 10x, el de Mac entiendo que es interesante si estás desarrolando aplicacionas nativas para iOS o MacOs).
  - Para no ir referenciando en cada paso a la carpeta del proyecto, con `working-directory` le indicamos que el directorio de trabajo es la carpeta `portal-video-practica`,(donde tenemos el código fuente), en mi caso no está en el raíz del repo, porque por ejemplo he definido el diseño, y el diagrama de modelo de BBD, en otra carpeta raíz.
  - Sobre los pasos:
    - `Checkout`: esto nos sirve para clonar el repositorio en la máquin Ubuntu y poder trabajar con el código fuente.

    - `Setup Node`: La máquina Ubuntu, viene limpia y nos hace falta node para poder instalar dependencias, ejecutar los tests etc... aquí le indicamos que queremos usar la versión 20 de Node, y esto se encarga de instalarla en la máquina.

    - `npm ci`: este paso es importante, instala las dependencias del proyecto, aquí podríamos pensar ¿Por qué no usar `npm install`? La diferencia es que `npm ci` se encarga de instalar exactamente las dependencias que tenemos definidas en el `package-lock.json`, y si alguna de esas dependencias no está instalada, lo hace internamente, mientras que `npm install` puede actualizar el `package-lock.json` si encuentra alguna dependencia que no está instalada o que tiene una versión diferente a la definida en el `package-lock.json`, lo cual puede llevar a inconsistencias entre el entorno de desarrollo y el entorno de CI/CD.

    - `npm run lint`: este paso se encarga de revisar la calidad del código, y si encuentra algún error de lint, el flujo de CI/CD falla y no se puede mergear el pull request a main.

    - `npm run test:run`: este paso se encarga de ejecutar los tests unitarios que tenemos definidos en el proyecto, y si alguno de ellos falla, el flujo de CI/CD falla y no se puede mergear el pull request a main.

Si todo esto funciona bien, el flujo de CI tiene éxito.

Ojo, por defecto Github Actions, ejecutará este flujo al pedir PR a main, pero el usuario podría directamente mezclar a main, sin ni siquiera esperara a que termine o incluso habiendo fallado, para evitar esto tenemos que irnos a Github Settings > Branches > Main > Branch Protection Rules, y aquí podemos configurar que para mezclar a main, el flujo de CI tiene que haber tenido éxito, de esta forma nos aseguramos que no se mezcle código a main sin pasar por el proceso de revisión de código y ejecución de tests (aún así el usuario podría forzarlo si es administrador, pero esto tiene su lógica, ya que un admin puede tener criterio para en un caso concreto saltar el proceso de CI/CD).

# CD

En este flujo (./github/cd.yml) desplegamos a Render, y lo hacemos empaquetando la aplicacíon en un contenedor Docker.

Que tiene este flujo:

- Lo primero le indicamos con el tag `on` que sólo se ejecute cuando se hagan cambios a la rama main, de esta forma nos aseguramos que sólo se despliegue código que ya ha pasado por el proceso de revisión de código y ejecución de tests (hay veces en las que se tiene una rama `main` y otra `dev`, y hay un CD que dispara al hacer merge a `dev` y despliega en un entorno de staging, y otro CD que se dispara al hacer merge a `main` y despliega a producción, esto es una buena práctica para asegurarnos que el código que se despliega a producción ya ha pasado por un entorno de staging).

- Vamos con los jobs, aqí tenemos uno que es `build-and-deploy`.

- Aquí también le indicamos que corra en una máquina Ubuntu (tag `runs-on`).

- También le indicamos que el directorio de trabajo es la carpeta `portal-video-practica` (tag `working-directory`).

- Y los pasos:
  - `Checkout`: igual que en el flujo de CI.
  - `Setup Node`: igual que en el flujo de CI.

  - `npm ci`: igual que en el flujo de CI.

  - `Build`:
    - Hay dos variables de entorno que son necesarias para hacer el build, que son `CONTENT_ISLAND_TOKEN` y `OPENROUTER`, estas variables las tengo definidas en GitHub Secrets, y aquí las inyecto en el entorno para que estén disponibles en el proceso de build.

    - `run`: aquí lo que hacemos es ejecutar el comando que tenemos definido en el `package.json` para hacer el build de la aplicación, que es `npm run build`, este comando se encarga de generar una carpeta `dist` con el código optimizado para producción.

    - En el siguiente paso necesitamos logarnos al registro de `Github Container Registry` para poder subir la imagen de Docker que vamos a generar (lo bueno de este registry es que se lleva muy bien con Github Actions, y es gratuito para repositorios públicos, y para repositorio privados te deja usarlo de forma gratuita hacer cierto límite). Nosotros hemos elegido tenerlo público, porque Render no te permite usarlo con el registry privado en la versión gratuita, aquí:
      - Le indicamos que el registry es el de Github (ghcr.io).
      - El username es el de Github Actions (`GITHUB_ACTOR`): es decir, el usuario que ha disparado el flujo de CI/CD, en este caso sería mi usuario de Github, OJO, tal y como está definido ahora, podría poner cualquier nombre aquí ya que la info relevante se guarda en GITHUB_TOKEN, pero por claridad y buenas prácticas, lo ideal es usar el usuario que ha disparado el flujo de CI/CD.
      - Sobre el password aquí viene una parte interesante:
        - El propio github actions nos da un token de acceso automático a través de la variable de entorno `GITHUB_TOKEN`, este token tiene permisos de lectura y escritura en el repositorio, lo cual incluye el registry de Github Container Registry, por lo que podríamos usar directamente este token para autenticarnos y subir la imagen de Docker, pero esto sólo vale si nuestra imagen está cómo pública, si no Render no sería capaz de acceder al _gchr_, aquí tendríamos que crear un PAT (persona access token), eso lo podremos crear desde mi perfil >> settings >> developer settings >> personal access tokens >> Tokens (Classic), y lo tendríamos que guardar como un secreto, esto no lo he implementado porque Render en su versión gratuita no permite usar imágenes privadas, pero es importante saber que esta sería la opción a elegir si queremos mantener la imagen privada.

  - En el siguiente paso `Build and publis Docker Image`: se crea la imagen en base al `dokcerfile` de nuestro proyecto, y se sube al registry de Github Container Registry, el nombre de la imagen y el tag lo tengo definido en dos secretos de Github, `IMAGE_NAME` e `IMAGE_TAG`, esto es importante porque luego en Render a la hora de configurar el despliegue, necesito indicarle el nombre de la imagen y el tag para que pueda tirar de esa imagen a la hora de desplegar.

  - Por último le indicamos a Render que hay una nueva imagen, para que pueda tirar de esa imagen y desplegarla, esto lo hacemos a través de un webhook que nos da Render, y que tenemos guardado como un secreto de Github (`RENDER_DEPLOY_HOOK_URL`), al hacer la petición a este webhook, Render se entera de que hay una nueva imagen, y se encarga de desplegarla automáticamente:
    - Un webhook sirve para que git pueda invocar a render para hacer algo.
    - Este webhook necesita un secreto para saber que soy yo el que está lanzando la petición de volver a hacer un build (si no un usuario malicioso podría hacer peticiones a este webhook para intentar saturar el servicio de Render lanzando builds continuamente).
    - El valor del secreto lo puedo obtener de render(settings >> Deploy >> DeployHook)
    - Este valor del webhook lo almaceno en mi repositorio de Github como un secreto para tenerlo de forma segura.
    - Para evitar que roben este webhook, Github te permite introducirlo pero después no puedes ver su valor, por otro lado si quedará comprometido, en Render podemos generar un nuevo y el anterior quedaría como no valido.

# Flujo visual

He realizado este diagrama en papel y después le he pedido a una herramienta IA que lo generará para consumir en formato markdown, auqí se puede ver un resumen gráfico del proceso:

```
┌─────────────────────────────────────────────────────────┐
│              FLUJO DE TRABAJO CI / CD                   │
└────────────────────────────┬────────────────────────────┘
                             │
                  git push (rama feature)
                             ▼
┌─────────────────────────────────────────────────────────┐
│               PULL REQUEST -> MAIN                      │
└────────────────────────────┬────────────────────────────┘
                             │ dispara ci.yml
                             ▼
┌─────────────────────────────────────────────────────────┐
│          CI (Ubuntu / Node 20 / app dir)                │
│                                                         │
│  [ npm ci ] ──▶ [ Lint ] ──▶ [ Test Unitarios Vitest ]  │
└────────────────────────────┬────────────────────────────┘
                             │
           ┌─────────────────┴─────────────────┐
           ▼                                   ▼
┌────────────────────┐               ┌────────────────────┐
│   FALLA EN TESTS   │               │   TESTS PASADOS    │
│         ❌         │               │         ✅         │
└──────────┬─────────┘               └──────────┬─────────┘
           │                                    │
           ▼                                    ▼
┌────────────────────┐               ┌────────────────────┐
│  MERGE BLOQUEADO   │               │ BRANCH PROTECTION  │
│ (GitHub Settings)  │               │  Permite el Merge  │
└────────────────────┘               └─────────┬──────────┘
                                               │
                                    Merge a main (cd.yml)
                                               ▼
┌─────────────────────────────────────────────────────────┐
│               CD (Ubuntu / Node 20)                     │
│                                                         │
│ [ Build Vite ] ──▶ [ Docker Build ] ──▶ [ Push GHCR ]   │
└────────────────────────────┬────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────┐
│        NOTIFICACIÓN Y DESPLIEGUE FINAL                  │
│                                                         │
│ [ Render Deploy Hook ] ──▶ [ Nuevo Contenedor 🚀 ]      │
└─────────────────────────────────────────────────────────┘
```
