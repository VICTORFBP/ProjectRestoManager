import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Home, Utensils, ListOrdered, Table2, Users, LogOut, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function AppLayout() {
  const { user, logout, isAdmin, isMesero } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 font-bold text-xl border-b border-gray-700">
          RestoManager
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {/* Dashboard - para ambos */}
          <NavItem to="/" label="Inicio" icon={<Home size={18} />} show={isAdmin() || isMesero()} />
          
          {/* Menú - solo admin */}
          <NavItem to="/menu-items" label="Menú" icon={<Utensils size={18} />} show={isAdmin()} />
          
          {/* Pedidos - admin y mesero */}
          <NavItem to="/orders" label="Pedidos" icon={<ListOrdered size={18} />} show={isAdmin() || isMesero()} />
          
          {/* Mesas - admin y mesero (pero mesero solo ve) */}
          <NavItem to="/tables" label="Mesas" icon={<Table2 size={18} />} show={isAdmin() || isMesero()} />
          
          {/* Usuarios - solo admin */}
          <NavItem to="/users" label="Usuarios" icon={<Users size={18} />} show={isAdmin()} />
          
          {/* Para clientes */}
          <NavItem to="/menu" label="Ver Menú" icon={<Utensils size={18} />} show={!isAdmin() && !isMesero()} />
          <NavItem to="/my-orders" label="Mis Pedidos" icon={<ListOrdered size={18} />} show={!isAdmin() && !isMesero()} />
        </nav>

        {/* User info + Logout */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 mb-3 text-sm">
            <User size={18} />
            <div>
              <div className="font-medium">{user?.first_name} {user?.last_name}</div>
              <div className="text-xs text-gray-400">{user?.role?.name}</div>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 transition"
          >
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* CONTENIDO */}
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}

function NavItem({ to, label, icon, show = true }) {
  if (!show) return null;
  
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