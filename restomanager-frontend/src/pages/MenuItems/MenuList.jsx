import { useEffect, useState } from "react";
import menuItemsAPI from "../../api/menuItems";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, PlusCircle } from "lucide-react";

export default function MenuList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadMenuItems();
  }, []);

  const loadMenuItems = async () => {
    try {
      const res = await menuItemsAPI.getAll();
      setItems(res.data);
    } catch (error) {
      console.error("Error cargando menú:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await menuItemsAPI.remove(deleteId);
      setDeleteId(null);
      loadMenuItems();
    } catch (error) {
      console.error("Error eliminando ítem:", error);
    }
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Menú</h1>
        <Button
          onClick={() => navigate("/menu-items/create")}
          variant="primary"
          className="flex items-center gap-2"
        >
          <PlusCircle size={18} /> Nuevo Plato
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Nombre</th>
              <th className="py-2 px-4 border">Precio</th>
              <th className="py-2 px-4 border">Categoría</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No hay platos
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">{item.name}</td>
                  <td className="py-2 px-4 border">${item.price}</td>
                  <td className="py-2 px-4 border">{item.category?.name || "-"}</td>
                  <td className="py-2 px-4 border flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/menu-items/edit/${item.id}`)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setDeleteId(item.id)}
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
        <p>¿Seguro que deseas eliminar este plato?</p>
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
