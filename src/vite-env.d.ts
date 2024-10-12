/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_PROJECT_URL: string
  readonly VITE_SUPABASE_API_KEY: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY: string
  readonly VITE_GOOGLE_MAPS_ID: string
  readonly VITE_REDIS_URL: string
  readonly VITE_SMTP_HOST: string
  readonly VITE_SMTP_PORT: number
  readonly VITE_SMTP_USER: string
  readonly VITE_SMTP_PASSWORD: string
  // Añadir otras variables de entorno según sea necesario
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
