import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Clock, CheckCircle, AlertCircle, Utensils, Users } from "lucide-react";
import ordersAPI from "../api/orders";
import tablesAPI from "../api/tables";

export default function DashboardMesero() {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // Actualizar cada 30 segundos
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [ordersRes, tablesRes] = await Promise.all([
        ordersAPI.getAll(),
        tablesAPI.getAll()
      ]);
      
      setOrders(ordersRes.data);
      setTables(tablesRes.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    pending: orders.filter(o => o.status === 'pendiente').length,
    preparing: orders.filter(o => o.status === 'preparando').length,
    served: orders.filter(o => o.status === 'servido').length,
  };

  const urgentOrders = orders.filter(order => {
    const orderTime = new Date(order.created_at);
    const now = new Date();
    const diffMinutes = (now - orderTime) / (1000 * 60);
    return order.status === 'pendiente' && diffMinutes > 15;
  });

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Utensils className="text-blue-500" />
          Panel del Mesero
        </h1>
        <Link
          to="/orders/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <Plus size={20} />
          Nueva Orden
        </Link>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <div className="flex items-center gap-3">
            <Clock className="text-yellow-500" size={24} />
            <div>
              <p className="text-2xl font-bold">{stats.pending}</p>
              <p className="text-gray-600">Pendientes</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <Utensils className="text-blue-500" size={24} />
            <div>
              <p className="text-2xl font-bold">{stats.preparing}</p>
              <p className="text-gray-600">En Cocina</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <div className="flex items-center gap-3">
            <AlertCircle className="text-orange-500" size={24} />
            <div>
              <p className="text-2xl font-bold">{stats.served}</p>
              <p className="text-gray-600">Por Servir</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas Urgentes */}
      {urgentOrders.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="text-red-500" size={20} />
            <h3 className="font-semibold text-red-800">Órdenes Urgentes</h3>
          </div>
          <div className="space-y-2">
            {urgentOrders.map(order => (
              <div key={order.id} className="flex justify-between items-center bg-white p-3 rounded border">
                <div>
                  <span className="font-medium">Orden #{order.id}</span>
                  <span className="text-sm text-gray-600 ml-2">
                    - Mesa {order.table?.name || 'N/A'}
                  </span>
                </div>
                <span className="text-sm text-red-600">
                  {Math.round((new Date() - new Date(order.created_at)) / (1000 * 60))} min esperando
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Acciones Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <Link
              to="/orders/create"
              className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition text-center font-semibold"
            >
              Crear Nueva Orden
            </Link>
            <Link
              to="/orders"
              className="block w-full bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition text-center font-semibold"
            >
              Ver Todas las Órdenes
            </Link>
            <Link
              to="/tables"
              className="block w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition text-center font-semibold"
            >
              Ver Estado de Mesas
            </Link>
          </div>
        </div>

        {/* Mesas Disponibles */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Users size={20} />
            Mesas Disponibles
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {tables.filter(t => t.status === 'disponible').slice(0, 6).map(table => (
              <div key={table.id} className="bg-green-100 border border-green-300 rounded-lg p-3 text-center">
                <div className="font-bold text-lg">{table.name}</div>
                <div className="text-sm text-green-700">{table.seats} personas</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}