This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Pruebas solicitadas (Issue: Implementacion de Pruebas)

### Casos de uso cubiertos

1. **Generación asistida por IA** (`POST /api/generate`)
2. **Control de límite diario de solicitudes IA**

### Ejecución de pruebas automáticas

```bash
npm run test -- src/modules/editor/hooks/rateLimitUtils.test.ts src/app/api/generate/route.test.ts
```

### Pruebas manuales

#### Caso 1: Generación asistida por IA

1. Iniciar la app: `npm run dev`
2. Abrir `http://localhost:3000`
3. Abrir el panel de IA.
4. Enviar una instrucción con contenido cargado y verificar que retorna texto generado.
5. Validación adicional sin API key:
   - Quitar `GEMINI_API_KEY` de `.env.local`
   - Repetir la solicitud y verificar mensaje: `Error: GEMINI_API_KEY is not configured in .env.local`

#### Caso 2: Control de límite diario

1. Con la app abierta, realizar solicitudes IA consecutivas.
2. Verificar que el contador de solicitudes disminuye por cada petición.
3. Alcanzar el límite diario y confirmar que no permite nuevas solicitudes.
4. Simular cambio de día (limpiar/ajustar `localStorage` clave `markflow_ai_usage`) y validar que el contador se reinicia.

### Reporte de resultados (automáticas)

- Fecha de ejecución: **2026-04-21**
- Archivos de prueba ejecutados: **2**
- Total de pruebas: **6**
- Resultado: **6/6 exitosas**
