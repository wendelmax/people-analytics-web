/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_MOCK_API_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_ENVIRONMENT: string;
  readonly VITE_USE_MOCK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

