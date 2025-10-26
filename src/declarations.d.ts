declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

// --- для Vite ---
interface ImportMetaEnv {
  readonly VITE_BASENAME?: string;
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// для Jest
declare const global: {
  importMeta: ImportMeta;
};
