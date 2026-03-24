import { Outlet } from "react-router-dom";
import Menu from "./Menu";
import AvisoOffline from "./AvisoOffline";
import { useApp } from "../hooks/useApp";

export default function Layout() {
  const { versaoApp } = useApp();

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-4xl p-4">
        <Menu />

        <Outlet />

        <div className="mt-10 text-center text-xs text-gray-500">
          {versaoApp}
        </div>
      </main>

      <AvisoOffline />
    </div>
  );
}