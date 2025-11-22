import { useEffect, useState } from "react";
import ordersAPI from "../../api/orders";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getStatusBadge = (status) => {
    const styles = {
      pendiente: "bg-yellow-100 text-yellow-800",
      servido: "bg-blue-100 text-blue-800",
      completado: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Órdenes</h1>

        <Link to="/orders/create">
          <Button>
            <div className="flex items-center gap-2">
              <PlusCircle size={18} /> Crear Orden
            </div>
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Mesa</th>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-500">
                  No hay órdenes registradas.
                </td>
              </tr>
            )}

            {orders.map((o) => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{o.id}</td>
                <td className="p-3">{o.table?.name || 'N/A'}</td>
                <td className="p-3">
                  {o.customer 
                    ? `${o.customer.first_name} ${o.customer.last_name}` 
                    : 'N/A'}
                </td>
                <td className="p-3">${Number(o.total || 0).toFixed(2)}</td>
                <td className="p-3">{getStatusBadge(o.status)}</td>

                <td className="p-3 flex justify-end gap-2">
                  <Link to={`/orders/edit/${o.id}`}>
                    <button className="p-2 bg-gray-200 hover:bg-gray-300 rounded-lg">
                      <Pencil size={18} />
                    </button>
                  </Link>

                  <button
                    onClick={() => handleDelete(o.id)}
                    className="p-2 bg-red-200 hover:bg-red-300 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}