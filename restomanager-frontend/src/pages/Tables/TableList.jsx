import { useEffect, useState } from "react";
import tablesAPI from "../../api/tables";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

export default function TableList() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const res = await tablesAPI.getAll();
      setTables(res.data);
    } catch (error) {
      console.error("Error cargando mesas:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await tablesAPI.remove(deleteId);
      setDeleteId(null);
      loadTables();
    } catch (error) {
      console.error("Error eliminando mesa:", error);
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      disponible: "bg-green-100 text-green-800",
      ocupada: "bg-red-100 text-red-800",
      reservada: "bg-yellow-100 text-yellow-800",
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100"}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Mesas</h1>
        <Button
          onClick={() => navigate("/tables/create")}
          variant="primary"
          className="flex items-center gap-2"
        >
          <PlusCircle size={18} /> Nueva Mesa
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left">Número</th>
              <th className="p-3 text-left">Capacidad</th>
              <th className="p-3 text-left">Estado</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tables.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No hay mesas
                </td>
              </tr>
            ) : (
              tables.map((table) => (
                <tr key={table.id} className="hover:bg-gray-50 border-b">
                  <td className="py-3 px-4">Mesa {table.number}</td>
                  <td className="py-3 px-4">{table.capacity} personas</td>
                  <td className="py-3 px-4">{getStatusBadge(table.status)}</td>
                  <td className="py-3 px-4 flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/tables/edit/${table.id}`)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setDeleteId(table.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación */}
      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirmar eliminación"
      >
        <p>¿Seguro que deseas eliminar esta mesa?</p>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  );
}