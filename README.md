# Blog

Aplicación de blog construida con React + Vite y Supabase.

## Requisitos

- Node.js >= 18

## Instalación

```bash
cd blog/blog
npm install
```

## Variables de entorno

Crea un archivo `.env` en `blog/blog/` con tus credenciales de Supabase:

```env
VITE_SUPABASE_URL=tu_url
VITE_SUPABASE_PUBLISHABLE_KEY=tu_key
```

## Scripts

```bash
npm run dev      # Inicia el servidor de desarrollo
npm run build    # Construye para producción
npm run preview  # Previsualiza la build de producción
npm run lint     # Ejecuta el linter
```

## Uso

1. Crea un proyecto en [Supabase](https://supabase.com/)
2. Crea una tabla `posts` con al menos las columnas `id`, `title`, `content`
3. Configura las políticas de RLS según tus necesidades
4. Copia la URL y la clave publishable en `.env`
5. Ejecuta `npm run dev`
