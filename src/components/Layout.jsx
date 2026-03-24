import { Outlet } from "react-router-dom";
import AvisoOffline from "./AvisoOffline";
import { useApp } from "../hooks/useApp";

export default function Layout() {
  const { versaoApp } = useApp();

  return (
    <div className="min-h-screen w-full bg-[var(--cor-fundo)]">
      <Outlet />

      <div className="fixed bottom-2 left-0 w-full text-center text-[10px] text-gray-400">
        {versaoApp}
      </div>

      <AvisoOffline />
    </div>
  );
}