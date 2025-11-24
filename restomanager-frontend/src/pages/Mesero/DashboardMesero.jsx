import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Clock, CheckCircle, AlertCircle, Utensils } from "lucide-react";
import ordersAPI from "../api/orders";
import tablesAPI from "../api/tables";

export default function DashboardMesero() {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    preparing: 0,
    served: 0,
    completed: 0
  });

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
      calculateStats(ordersRes.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (ordersData) => {
    const stats = {
      pending: ordersData.filter(o => o.status === 'pendiente').length,
      preparing: ordersData.filter(o => o.status === 'preparando').length,
      served: ordersData.filter(o => o.status === 'servido').length,
      completed: ordersData.filter(o => o.status === 'completado').length
    };
    setStats(stats);
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await ordersAPI.update(orderId, { status: newStatus });
      await loadData(); // Recargar datos
    } catch (error) {
      console.error("Error actualizando orden:", error);
      alert("Error al actualizar el estado de la orden");
    }
  };

  const getUrgentOrders = () => {
    return orders.filter(order => {
      const orderTime = new Date(order.created_at);
      const now = new Date();
      const diffMinutes = (now - orderTime) / (1000 * 60);
      return order.status === 'pendiente' && diffMinutes > 15;
    });
  };

  const urgentOrders = getUrgentOrders();

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-500" size={24} />
            <div>
              <p className="text-2xl font-bold">{stats.completed}</p>
              <p className="text-gray-600">Completados</p>
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

      {/* Órdenes Recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Órdenes Activas */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg">Órdenes Activas</h3>
          </div>
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {orders.filter(o => ['pendiente', 'preparando', 'servido'].includes(o.status)).length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay órdenes activas</p>
            ) : (
              orders
                .filter(o => ['pendiente', 'preparando', 'servido'].includes(o.status))
                .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
                .map(order => (
                  <OrderCard 
                    key={order.id} 
                    order={order} 
                    onStatusUpdate={updateOrderStatus}
                  />
                ))
            )}
          </div>
        </div>

        {/* Mesas */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-lg">Estado de Mesas</h3>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {tables.map(table => (
                <TableStatus key={table.id} table={table} orders={orders} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente para tarjeta de orden
function OrderCard({ order, onStatusUpdate }) {
  const getStatusColor = (status) => {
    const colors = {
      pendiente: 'bg-yellow-100 text-yellow-800',
      preparando: 'bg-blue-100 text-blue-800',
      servido: 'bg-orange-100 text-orange-800',
      completado: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getNextStatus = (currentStatus) => {
    const transitions = {
      pendiente: 'preparando',
      preparando: 'servido',
      servido: 'completado'
    };
    return transitions[currentStatus];
  };

  const nextStatus = getNextStatus(order.status);

  return (
    <div className="border rounded-lg p-3 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <div>
          <span className="font-semibold">Orden #{order.id}</span>
          <span className="text-sm text-gray-600 ml-2">
            Mesa {order.table?.name || 'N/A'}
          </span>
        </div>
        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        <div>Cliente: {order.customer ? `${order.customer.first_name} ${order.customer.last_name}` : 'Walk-in'}</div>
        <div>Items: {order.items?.length || 0}</div>
        <div>Total: ${Number(order.total || 0).toFixed(2)}</div>
        <div className="text-xs">
          {new Date(order.created_at).toLocaleTimeString()}
        </div>
      </div>

      {nextStatus && (
        <button
          onClick={() => onStatusUpdate(order.id, nextStatus)}
          className="w-full bg-blue-600 text-white py-1 rounded text-sm hover:bg-blue-700 transition"
        >
          Marcar como {nextStatus}
        </button>
      )}
    </div>
  );
}

// Componente para estado de mesa
function TableStatus({ table, orders }) {
  const tableOrders = orders.filter(o => o.table_id === table.id && o.status !== 'completado');
  const isOccupied = tableOrders.length > 0;

  return (
    <div className={`p-3 rounded-lg border text-center ${
      isOccupied ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
    }`}>
      <div className="font-semibold">{table.name}</div>
      <div className="text-sm text-gray-600">
        {table.seats} personas
      </div>
      <div className={`text-xs mt-1 ${
        isOccupied ? 'text-red-600' : 'text-green-600'
      }`}>
        {isOccupied ? `${tableOrders.length} orden(es)` : 'Disponible'}
      </div>
    </div>
  );
}