import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Providers } from "./Providers";
import { AppInit } from "./AppInit";
import "@/shared/styles/styles.scss";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Providers>
      <AppInit>
        <App />
      </AppInit>
    </Providers>
  </React.StrictMode>
);
