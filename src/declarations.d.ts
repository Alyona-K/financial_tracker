// --- MODULE DECLARATIONS & ENV TYPES ---
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

interface ImportMetaEnv {
  readonly VITE_BASENAME?: string;
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const global: {
  importMeta: ImportMeta;
};
