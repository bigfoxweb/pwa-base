import { createBrowserRouter } from "react-router-dom";

import Layout from "./components/Layout";

import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
    
    ],
  },

]);

export default router;