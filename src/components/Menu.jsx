import { Link, useLocation } from "react-router-dom";

export default function Menu() {
  const location = useLocation();

  const links = [
    { to: "/", label: "Início" },
    { to: "/configuracoes", label: "Configurações" },
  ];

  return (
    <nav className="mb-6 flex flex-wrap items-center justify-center gap-2">
      {links.map((link) => {
        const ativo = location.pathname.startsWith(link.to);

        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              ativo
                ? "bg-[#7d2211] text-white"
                : "bg-white text-gray-700 shadow-sm"
            }`}
          >
            {link.label}
          </NavLink>
        );
      })}
    </nav>
  );
}