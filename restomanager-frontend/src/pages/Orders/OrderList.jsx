import { useEffect, useState } from "react";
import ordersAPI from "../../api/orders";
import Button from "../../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { Pencil, Trash2, PlusCircle, Filter, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const { isMesero } = useAuth();
  const navigate = useNavigate();

  const loadData = async () => {
    try {
      const res = await ordersAPI.getAll();
      setOrders(res.data);
    } catch (error) {
      console.error("Error cargando órdenes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar la orden?")) return;

    try {
      await ordersAPI.remove(id);
      loadData();
    } catch (error) {
      console.error("Error eliminando orden:", error);
    }
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

  const getStatusBadge = (status) => {
    const styles = {
      pendiente: "bg-yellow-100 text-yellow-800 border border-yellow-200",
      preparando: "bg-blue-100 text-blue-800 border border-blue-200",
      servido: "bg-orange-100 text-orange-800 border border-orange-200",
      completado: "bg-green-100 text-green-800 border border-green-200",
      cancelado: "bg-red-100 text-red-800 border border-red-200",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const filteredOrders = filter === "all" 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getNextStatus = (currentStatus) => {
    const transitions = {
      pendiente: 'preparando',
      preparando: 'servido',
      servido: 'completado'
    };
    return transitions[currentStatus];
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
        Cargando órdenes...
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Órdenes</h1>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
            title="Actualizar"
          >
            <RefreshCw size={18} />
          </button>

          <Link to="/orders/create">
            <Button className="flex items-center gap-2">
              <PlusCircle size={18} />
              Nueva Orden
            </Button>
          </Link>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-600" />
            <span className="font-medium">Filtrar por estado:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {["all", "pendiente", "preparando", "servido", "completado", "cancelado"].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1 rounded-full text-sm transition ${
                  filter === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {status === "all" ? "Todos" : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
        {["pendiente", "preparando", "servido", "completado", "cancelado", "all"].map(status => {
          const count = status === "all" 
            ? orders.length 
            : orders.filter(o => o.status === status).length;
          
          const labels = {
            all: "Total",
            pendiente: "Pendientes",
            preparando: "En Cocina",
            servido: "Por Servir",
            completado: "Completados",
            cancelado: "Cancelados"
          };

          return (
            <div key={status} className="bg-white rounded-lg shadow p-3 text-center">
              <div className="text-2xl font-bold text-blue-600">{count}</div>
              <div className="text-sm text-gray-600">{labels[status]}</div>
            </div>
          );
        })}
      </div>

      {/* Tabla de Órdenes */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Mesa</th>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Tiempo</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="8" className="p-6 text-center text-gray-500">
                  No hay órdenes {filter !== "all" ? `con estado "${filter}"` : ""}.
                </td>
              </tr>
            )}

            {filteredOrders
              .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              .map((order) => {
                const nextStatus = getNextStatus(order.status);
                const orderTime = new Date(order.created_at);
                const now = new Date();
                const diffMinutes = Math.round((now - orderTime) / (1000 * 60));

                return (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">#{order.id}</td>
                    <td className="p-3">{order.table?.name || 'N/A'}</td>
                    <td className="p-3">
                      {order.customer 
                        ? `${order.customer.first_name} ${order.customer.last_name}` 
                        : 'Walk-in'}
                    </td>
                    <td className="p-3 font-semibold">${Number(order.total || 0).toFixed(2)}</td>
                    <td className="p-3">{getStatusBadge(order.status)}</td>
                    <td className="p-3">
                      <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                        {order.items?.length || 0} items
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-sm ${
                        diffMinutes > 30 ? 'text-red-600' : 
                        diffMinutes > 15 ? 'text-orange-600' : 'text-gray-600'
                      }`}>
                        {diffMinutes} min
                      </span>
                    </td>

                    <td className="p-3 flex justify-end gap-2">
                      {isMesero() && nextStatus && (
                        <button
                          onClick={() => updateOrderStatus(order.id, nextStatus)}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                        >
                          {nextStatus}
                        </button>
                      )}
                      
                      <Link to={`/orders/edit/${order.id}`}>
                        <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
                          <Pencil size={16} />
                        </button>
                      </Link>

                      {!isMesero() && (
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-2 bg-red-200 hover:bg-red-300 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}