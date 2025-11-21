import { Outlet, NavLink } from "react-router-dom";
import { Home, Utensils, ListOrdered, Table2, Users } from "lucide-react";

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 font-bold text-xl border-b border-gray-700">
          RestoManager
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          <NavItem to="/" label="Dashboard" icon={<Home size={18} />} />
          <NavItem to="/menu-items" label="Menú" icon={<Utensils size={18} />} />
          <NavItem to="/orders" label="Pedidos" icon={<ListOrdered size={18} />} />
          <NavItem to="/tables" label="Mesas" icon={<Table2 size={18} />} />
          <NavItem to="/users" label="Usuarios" icon={<Users size={18} />} />
        </nav>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, label, icon }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition ${
          isActive
            ? "bg-blue-600 text-white"
            : "text-gray-300 hover:bg-gray-800 hover:text-white"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
