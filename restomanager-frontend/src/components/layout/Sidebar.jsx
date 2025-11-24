import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Utensils,
  Receipt,
  Table,
  Users,
  UserCog
} from "lucide-react";

export default function Sidebar() {
  const { pathname } = useLocation();

  const menu = [
    { label: "Dashboard", to: "/", icon: <LayoutDashboard size={20} /> },
    { label: "Menú", to: "/menu-items", icon: <Utensils size={20} /> },
    { label: "Pedidos", to: "/orders", icon: <Receipt size={20} /> },
    { label: "Mesas", to: "/tables", icon: <Table size={20} /> },
    { label: "Clientes", to: "/customers", icon: <Users size={20} /> },
    { label: "Usuarios", to: "/users", icon: <UserCog size={20} /> },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-gray-200 h-full p-6 shadow-xl">

      <h2 className="text-xl font-bold mb-8 text-white tracking-wide">
        Panel de Control
      </h2>

      <ul className="flex flex-col gap-3">
        {menu.map((item) => {
          const active = pathname === item.to;

          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all 
                  ${
                    active
                      ? "bg-blue-600 text-white shadow-md"
                      : "hover:bg-gray-700 hover:text-white"
                  }
                `}
              >
                {item.icon}
                <span className="text-md font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

    </aside>
  );
}
