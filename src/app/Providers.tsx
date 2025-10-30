import { ReactNode } from "react";
import { BrowserRouter } from "react-router-dom";
import ErrorBoundary from "@/app/ErrorBoundary";

type ProvidersProps = { children: ReactNode };

export const Providers = ({ children }: ProvidersProps) => {
  const basename = import.meta.env.VITE_BASENAME || "/";

  return (
    <ErrorBoundary>
      <BrowserRouter basename={basename}>{children}</BrowserRouter>
    </ErrorBoundary>
  );
};

