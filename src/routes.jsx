import { createBrowserRouter } from "react-router-dom";

import Layout from "./components/Layout";

import Inicio from "./pages/Inicio";
import Offline from "./pages/Offline";
import Configuracoes from "./pages/Configuracoes";
import NaoEncontrado from "./pages/NaoEncontrado";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Inicio />,
      },
      {
        path: "configuracoes",
        element: <Configuracoes />,
      },
      {
        path: "offline",
        element: <Offline />,
      },
    ],
  },
  {
    path: "*",
    element: <NaoEncontrado />,
  },
]);

export default router;