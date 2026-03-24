import { useCallback, useEffect, useMemo, useState } from "react";
import { AppContext } from "./AppContext";

function detectarModoStandalone() {
  if (typeof window === "undefined") return false;

  const porDisplayMode = window.matchMedia?.("(display-mode: standalone)")?.matches;
  const porIOS = window.navigator.standalone === true;

  return Boolean(porDisplayMode || porIOS);
}

function obterStatusOnline() {
  if (typeof navigator === "undefined") return true;
  return navigator.onLine;
}

function obterVersaoApp() {
  return import.meta.env.VITE_BUILD_DATE || "sem-versao";
}

export function AppProvider({ children }) {
  const [estaOnline, setEstaOnline] = useState(obterStatusOnline);
  const [appInstalado, setAppInstalado] = useState(detectarModoStandalone);
  const [eventoInstalacao, setEventoInstalacao] = useState(null);
  const [mostrarDebug, setMostrarDebug] = useState(false);

  const podeInstalar = Boolean(eventoInstalacao) && !appInstalado;
  const versaoApp = obterVersaoApp();

  useEffect(() => {
    function aoFicarOnline() {
      setEstaOnline(true);
    }

    function aoFicarOffline() {
      setEstaOnline(false);
    }

    window.addEventListener("online", aoFicarOnline);
    window.addEventListener("offline", aoFicarOffline);

    return () => {
      window.removeEventListener("online", aoFicarOnline);
      window.removeEventListener("offline", aoFicarOffline);
    };
  }, []);

  useEffect(() => {
    function aoBeforeInstallPrompt(event) {
      event.preventDefault();
      setEventoInstalacao(event);
    }

    function aoAppInstalado() {
      setAppInstalado(true);
      setEventoInstalacao(null);
    }

    window.addEventListener("beforeinstallprompt", aoBeforeInstallPrompt);
    window.addEventListener("appinstalled", aoAppInstalado);

    return () => {
      window.removeEventListener("beforeinstallprompt", aoBeforeInstallPrompt);
      window.removeEventListener("appinstalled", aoAppInstalado);
    };
  }, []);

  useEffect(() => {
    function atualizarModoStandalone() {
      setAppInstalado(detectarModoStandalone());
    }

    atualizarModoStandalone();

    const media = window.matchMedia?.("(display-mode: standalone)");
    media?.addEventListener?.("change", atualizarModoStandalone);

    return () => {
      media?.removeEventListener?.("change", atualizarModoStandalone);
    };
  }, []);

  const instalarApp = useCallback(async () => {
    if (!eventoInstalacao) return false;

    try {
      await eventoInstalacao.prompt();
      const escolha = await eventoInstalacao.userChoice;

      setEventoInstalacao(null);

      if (escolha?.outcome === "accepted") {
        setAppInstalado(true);
        return true;
      }

      return false;
    } catch (erro) {
      console.error("Erro ao tentar instalar o app:", erro);
      return false;
    }
  }, [eventoInstalacao]);

  const alternarDebug = useCallback(() => {
    setMostrarDebug((valorAtual) => !valorAtual);
  }, []);

  const valor = useMemo(
    () => ({
      estaOnline,
      appInstalado,
      podeInstalar,
      instalarApp,
      mostrarDebug,
      alternarDebug,
      versaoApp,
    }),
    [estaOnline, appInstalado, podeInstalar, instalarApp, mostrarDebug, alternarDebug, versaoApp]
  );

  return <AppContext.Provider value={valor}>{children}</AppContext.Provider>;
}