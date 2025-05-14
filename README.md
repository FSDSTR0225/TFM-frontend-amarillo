# 📚 BookMatch - Tu Tinder de Libros

> Encuentra tu próxima aventura literaria con un simple desliz.

## 📋 Índice de Contenidos

- [Sobre el Proyecto](#sobre-el-proyecto)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Visual-Studio-Code] (#visual-studio-code)
- [Primeros Pasos](#primeros-pasos)
  - [Prerrequisitos](#prerrequisitos)
  - [Instalación](#instalación)
- [Uso](#uso)
- [Flujo de Trabajo con Git](#flujo-de-trabajo-con-git)
- [Contribuciones](#contribuciones)
- [Enlaces Útiles](#enlaces-útiles)
- [Licencia](#licencia)
- [Equipo](#equipo)

## 🔍 Sobre el Proyecto

**BookMatch** es una innovadora aplicación web que revoluciona la forma en que descubres nuevos libros. Inspirada en la mecánica de las aplicaciones de citas, BookMatch te permite descubrir tu próximo libro favorito con gestos intuitivos: desliza a la derecha para guardar un libro que te interesa o a la izquierda para pasar al siguiente.

La aplicación te muestra portadas, sinopsis breves y valoraciones de otros usuarios, permitiéndote crear una biblioteca personalizada basada en tus preferencias literarias y descubrir nuevos géneros y autores.

## 🛠️ Tecnologías Utilizadas

Este proyecto de frontend está construido con las siguientes tecnologías:

### Dependencias Principales

- **React**: ^19.0.0
- **React DOM**: ^19.0.0
- **Tailwind CSS**: ^v4.1.3

### Herramientas de Desarrollo

- **Vite**: ^6.2.0 - Bundler y entorno de desarrollo
- **ESLint**: ^9.21.0 - Linter de código
  - **@eslint/js**: ^9.21.0
  - **eslint-plugin-react-hooks**: ^5.1.0
  - **eslint-plugin-react-refresh**: ^0.4.19
- **TypeScript** (soporte mediante tipos):
  - **@types/react**: ^19.0.10
  - **@types/react-dom**: ^19.0.4
- **globals**: ^15.15.0

## 📁 Estructura del Proyecto

```
frontend/
├── public/
│   ├── favicon.ico
│   └── ...
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── BookCard/
│   │   ├── Swiper/
│   │   ├── Navbar/
│   │   └── ...
│   ├── pages/
│   │   ├── Home/
│   │   ├── Profile/
│   │   ├── Save/
│   │   └── Books/


│   ├── services/
│   ├── hooks/
│   ├── context/
│   ├── utils/
│   ├── index.css (Tailwind)
│   ├── App.jsx
│   └── main.jsx
├── .eslintrc.json
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## 🚀 Primeros Pasos

### Prerrequisitos

Para ejecutar este proyecto, necesitarás tener instalado:

- Node.js (preferiblemente la última versión LTS)
- npm o yarn como gestor de paquetes

### Instalación

1. **Clona el repositorio**

```bash
git clone https://github.com/FSDSTR0225/TFM-frontend-amarillo
```

2. **Instala las dependencias**

```bash
npm install
# o
yarn
```

3. **Inicia el servidor de desarrollo**

```bash
npm run dev
# o
yarn dev
```

4. **Accede a la aplicación**

Abre tu navegador y visita `http://localhost:5173`

## Visual Studio Code

**CRLF**
Se debe cambiar a modo CRLF en Visual Studio Code

## 💻 Uso

Una vez que la aplicación esté en funcionamiento, podrás:

1. Crear una cuenta o iniciar sesión
2. Configurar tus preferencias literarias (géneros favoritos, autores, etc.)
3. Explorar libros con el sistema de deslizamiento
4. Ver detalles de libros que te interesen
5. Acceder a tu biblioteca de "matches" y gestionar tus libros guardados

## 🌿 Flujo de Trabajo con Git

Para mantener un desarrollo organizado, seguimos el siguiente flujo de trabajo con Git:

### Ramas Principales

- `main`: Código de producción estable
- `develop`: Rama de desarrollo e integración

### Ramas de Características

Para nuevas funcionalidades, crea ramas con el siguiente formato:

- `nombre-de-la-funcionalidadNombre-Persona`

### Proceso de Pull Request

1. Crea tu rama desde `develop`
2. Desarrolla tu funcionalidad o corrección
3. Asegúrate de que pasa todas las pruebas
4. Crea un Pull Request a `develop`
5. Después de la revisión y aprobación, se fusionará con la rama principal

## 👥 Contribuciones

¡Las contribuciones son bienvenidas! Si deseas contribuir:

1. Haz un fork del proyecto
2. Crea tu rama de características (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Haz push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

Por favor, lee nuestras pautas de contribución antes de enviar un PR.

## 🔗 Enlaces Útiles

- [Documentación de React](https://reactjs.org/docs/getting-started.html)
- [Documentación de Vite](https://vitejs.dev/guide/)
- [Repositorio del Proyecto](https://github.com/FSDSTR0225/TFM-frontend-amarillo)
- [Tablero de Tareas](https://trello.com/b/HguGhcFs/tfm-fsdstr0225-amarillo)

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo `LICENSE` para más detalles.

## 👨‍💻 Equipo

- **[Pablo Pianelo]**
- **[Nombre ]**

---

Desarrollado con ❤️ por el equipo de amarillo
