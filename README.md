# Portfolio Personal

> Portfolio web personal desarrollado con Next.js 16, React 19 y Tailwind CSS 4

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

## Descripción

Portfolio personal moderno y minimalista que muestra mis proyectos, habilidades y experiencia profesional. Desarrollado con las últimas tecnologías del ecosistema React/Next.js para garantizar un rendimiento óptimo y una experiencia de usuario fluida.

## Características

- ⚡ **Rendimiento optimizado** con Next.js 16 y App Router
- 🎨 **Diseño responsive** adaptado a todos los dispositivos
- 🌓 **Modo claro/oscuro** con `next-themes`
- 📦 **Componentes reutilizables** con React 19
- 🎯 **TypeScript** para mayor seguridad y mantenibilidad
- 🚀 **Optimización automática** de fuentes e imágenes
- 💅 **Estilado moderno** con Tailwind CSS 4
- 🔧 **Linting y formateo** con Biome

## Tecnologías Principales

### Core
- **[Next.js 16](https://nextjs.org/)** - Framework de React con SSR y SSG
- **[React 19](https://react.dev/)** - Librería para interfaces de usuario
- **[TypeScript](https://www.typescriptlang.org/)** - Superset tipado de JavaScript
- **[Bun](https://bun.sh/)** - Runtime JavaScript ultrarrápido

### Estilos
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Framework CSS utility-first
- **[next-themes](https://github.com/pacocoursey/next-themes)** - Sistema de temas
- **[clsx](https://github.com/lukeed/clsx)** - Utilidad para clases condicionales
- **[tailwind-merge](https://github.com/dcastil/tailwind-merge)** - Merge de clases Tailwind

### Herramientas
- **[Biome](https://biomejs.dev/)** - Linter y formateador
- **[@untitledui/icons](https://www.untitledui.com/)** - Sistema de iconos
- **[@ridemountainpig/svgl-react](https://svgl.vercel.app/)** - Logos SVG
- **[Zod](https://zod.dev/)** - Validación de esquemas TypeScript-first

## Instalación

### Requisitos Previos

- **Bun** >= 1.0 ([Instalar Bun](https://bun.sh/docs/installation))
- **Node.js** >= 20.x (alternativo a Bun)

### Pasos de Instalación

1. **Clona el repositorio**

git clone https://github.com/jotis1/portfolio.git
cd portfolio

2. **Instala las dependencias**

Con Bun (recomendado):
bun install

Con npm:
npm install

3. **Ejecuta el servidor de desarrollo**

Con Bun:
bun dev

Con npm:
npm run dev

4. **Abre tu navegador**

Visita [http://localhost:3000](http://localhost:3000) para ver el resultado.

## Scripts Disponibles

# Iniciar servidor de desarrollo
bun dev

# Compilar para producción
bun run build

# Iniciar servidor de producción
bun start

# Ejecutar linter
bun run lint

# Formatear código
bun run format

## Estructura del Proyecto

portfolio/
├── app/                    # App Router de Next.js
│   ├── layout.tsx         # Layout principal
│   └── page.tsx           # Página principal
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y configuraciones
├── public/                # Archivos estáticos
├── styles/                # Estilos globales
├── utils/                 # Funciones auxiliares
├── biome.json            # Configuración de Biome
├── next.config.ts        # Configuración de Next.js
├── package.json          # Dependencias del proyecto
├── postcss.config.mjs    # Configuración de PostCSS
├── tailwind.config.ts    # Configuración de Tailwind
└── tsconfig.json         # Configuración de TypeScript

## Desarrollo

### Code Quality

El proyecto utiliza **Biome** para garantizar la calidad del código:

# Verificar problemas
bun run lint

# Formatear automáticamente
bun run format

### Configuración de Biome

El proyecto incluye una configuración personalizada en `biome.json` que define reglas de linting y formateo consistentes.

## Despliegue

### Vercel (Recomendado)

La forma más sencilla de desplegar este proyecto es usando [Vercel](https://vercel.com):

1. Haz push de tu código a GitHub
2. Importa tu repositorio en Vercel
3. Vercel detectará automáticamente Next.js y configurará el build

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jotis1/portfolio)

### Otras Plataformas

Este proyecto Next.js puede desplegarse en cualquier plataforma que soporte Node.js:

- **Netlify**: Compatible con Next.js mediante el plugin oficial
- **Railway**: Soporte nativo para Next.js
- **Cloudflare Pages**: Compatible con edge runtime
- **DigitalOcean App Platform**: Deployment directo desde GitHub

## Personalización

### Cambiar Temas

El proyecto usa `next-themes` para gestionar el modo claro/oscuro. Puedes personalizar los colores en tu configuración de Tailwind.

### Añadir Contenido

1. **Proyectos**: Edita los datos en el componente correspondiente
2. **Habilidades**: Modifica el array de tecnologías
3. **Experiencia**: Actualiza la información en los componentes de experiencia

## Optimización

El proyecto incluye optimizaciones de Next.js:

- ✅ Optimización automática de imágenes con `next/image`
- ✅ Carga optimizada de fuentes con `next/font`
- ✅ Generación estática de páginas (SSG)
- ✅ Code splitting automático
- ✅ Compresión de assets

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## Contacto

**Jotis** - [@jotis1](https://github.com/jotis1)

**Link del Proyecto**: [https://github.com/jotis1/portfolio](https://github.com/jotis1/portfolio)

---

⭐ Si este proyecto te ha sido útil, considera darle una estrella en GitHub