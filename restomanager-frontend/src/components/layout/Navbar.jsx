import { Link, useLocation } from "react-router-dom";
import { Menu, Utensils, Receipt, Table, Users, User } from "lucide-react";

export default function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { label: "Dashboard", to: "/", icon: <Menu size={18} /> },
    { label: "Menú", to: "/menu-items", icon: <Utensils size={18} /> },
    { label: "Pedidos", to: "/orders", icon: <Receipt size={18} /> },
    { label: "Mesas", to: "/tables", icon: <Table size={18} /> },
    { label: "Clientes", to: "/customers", icon: <Users size={18} /> },
  ];

  return (
    <nav className="w-full bg-gray-900 text-gray-200 shadow-lg px-6 py-4 flex justify-between items-center">
      
      {/* LOGO */}
      <Link to="/" className="text-2xl font-bold tracking-wide text-white">
        RestoManager
      </Link>

      {/* MENÚ CENTRAL */}
      <div className="flex gap-6">
        {links.map((item) => {
          const active = pathname === item.to;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all text-sm font-medium
                ${
                  active
                    ? "bg-blue-600 text-white shadow"
                    : "hover:bg-gray-700 hover:text-white"
                }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* AVATAR USUARIO */}
      <div className="flex items-center gap-3 cursor-pointer hover:text-white transition">
        <User size={22} />
        <span className="font-medium">Admin</span>
      </div>
    </nav>
  );
}
