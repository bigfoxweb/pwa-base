import { NavLink, useLocation } from "react-router-dom";

export default function Menu() {
  const location = useLocation();

  const links = [
    { to: "/", label: "Início" },
    { to: "/configuracoes", label: "Configurações" },
  ];

  return (
    <nav className="">
      {links.map((link) => {
        const ativo = location.pathname.startsWith(link.to);

        return (
          <NavLink
            key={link.to}
            to={link.to}
            className={`rounded-lg hidden px-4 py-2 text-sm font-medium transition ${
              ativo
                ? "bg-[#81c90e] text-white"
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