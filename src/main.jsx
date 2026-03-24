import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import App from "./App";
import "./index.css";
import { AppProvider } from "./context/AppProvider";


const atualizarServiceWorker = registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    console.log("SW URL registrado pelo plugin:", swUrl);
    console.log("SW registration do plugin:", registration);
  },
  onRegisterError(error) {
    console.error("Erro no registerSW do plugin:", error);
  },
  onNeedRefresh() {
    if (confirm("Nova versão disponível. Atualizar agora?")) {
      atualizarServiceWorker(true);
    }
  },
  onOfflineReady() {
    console.log("App pronto para uso offline");
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);