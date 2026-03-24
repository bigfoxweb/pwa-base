import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import TelaInicial from "./components/TelaInicial";
import { AppProvider } from "./context/AppContext";

export default function App() {
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCarregando(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  if (carregando) {
    return <TelaInicial />;
  }

  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}