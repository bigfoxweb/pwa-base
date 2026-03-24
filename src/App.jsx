import "./firebase/config";
import { RouterProvider } from "react-router-dom";
import router from "./routes";
import useFirebaseMessaging from "./hooks/useFirebaseMessaging";

export default function App() {
  const usuario = null;

  useFirebaseMessaging(usuario);

  return <RouterProvider router={router} />;
}