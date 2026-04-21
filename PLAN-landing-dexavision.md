# Plan: Landing Page DexaVision — Captura de Emails

## Qué es
Una landing page simple que presenta DexaVision y captura emails de interesados (dentistas y pacientes). Los emails se guardan en DynamoDB via Lambda.

## Arquitectura

```
[Landing (Next.js)] → POST /leads → [API Gateway] → [Lambda] → [DynamoDB]
```

## Stack
- **Frontend**: Next.js 15 + Tailwind CSS (proyecto standalone en `dexa-landing/`)
- **Backend**: Lambda + DynamoDB + API Gateway (dentro del CDK existente en `dexa-backend/`)
- **Hosting**: Vercel (igual que admin-frontend)

## DynamoDB — LeadsTable

| Campo | Tipo | Notas |
|-------|------|-------|
| email (PK) | String | Previene duplicados |
| name | String | Nombre del interesado |
| type | String | "dentist" o "patient" |
| createdAt | String | ISO timestamp |

## Estructura del landing

```
dexa-landing/
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── public/
├── src/app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── components/
│       ├── Hero.tsx         # Titular + CTA
│       ├── Features.tsx     # 3-4 beneficios clave
│       ├── LeadForm.tsx     # Formulario: nombre, email, tipo
│       └── Footer.tsx
```

## Pasos

### Paso 1: Backend
1. Crear `dexa-backend/lambda/collect-lead/index.ts` — valida email, guarda en DynamoDB, CORS
2. Agregar LeadsTable + Lambda + endpoint `POST /leads` (público, sin auth) en CDK

### Paso 2: Landing
3. Inicializar Next.js + Tailwind en `dexa-landing/`
4. Crear Hero, Features, LeadForm, Footer
5. Conectar formulario al endpoint

### Paso 3: Verificar
6. Probar localmente, enviar formulario, confirmar que el lead llega a DynamoDB
