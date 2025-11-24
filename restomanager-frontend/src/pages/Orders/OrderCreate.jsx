// src/pages/Orders/OrderCreate.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ordersAPI from "../../api/orders";
import tablesAPI from "../../api/tables";
import customersAPI from "../../api/customers";
import menuItemsAPI from "../../api/menuItems";
import { useAuth } from "../../context/AuthContext";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Plus, Trash2, Search } from "lucide-react";

export default function OrderCreate() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tables, setTables] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({
    table_id: "",
    customer_id: "",
    user_id: user?.id || "",
    status: "pendiente",
    notes: "",
    items: []
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [t, c, m] = await Promise.all([
        tablesAPI.getAll(),
        customersAPI.getAll(),
        menuItemsAPI.getAll()
      ]);

      setTables(t.data);
      setCustomers(c.data);
      setMenuItems(m.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = (menuItem) => {
    const existingItem = form.items.find(item => item.menu_item_id === menuItem.id);
    
    if (existingItem) {
      // Incrementar cantidad si ya existe
      setForm(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.menu_item_id === menuItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }));
    } else {
      // Agregar nuevo item
      setForm(prev => ({
        ...prev,
        items: [
          ...prev.items,
          {
            menu_item_id: menuItem.id,
            menu_item: menuItem,
            quantity: 1,
            price: menuItem.price,
            subtotal: menuItem.price
          }
        ]
      }));
    }
  };

  const updateItemQuantity = (menuItemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(menuItemId);
      return;
    }

    setForm(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.menu_item_id === menuItemId
          ? { 
              ...item, 
              quantity: newQuantity,
              subtotal: newQuantity * item.price
            }
          : item
      )
    }));
  };

  const removeItem = (menuItemId) => {
    setForm(prev => ({
      ...prev,
      items: prev.items.filter(item => item.menu_item_id !== menuItemId)
    }));
  };

  const calculateTotal = () => {
    return form.items.reduce((total, item) => total + item.subtotal, 0);
  };

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.category?.name && item.category.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.items.length === 0) {
      alert("Debe agregar al menos un item al pedido");
      return;
    }

    try {
      // Preparar datos para enviar
      const orderData = {
        table_id: form.table_id || null,
        customer_id: form.customer_id || null,
        user_id: form.user_id,
        status: form.status,
        notes: form.notes,
        items: form.items.map(item => ({
          menu_item_id: item.menu_item_id,
          quantity: item.quantity,
          price: item.price
        }))
      };

      await ordersAPI.create(orderData);
      alert("¡Orden creada exitosamente!");
      navigate("/orders");
    } catch (error) {
      console.error("Error creando orden:", error);
      alert("Error al crear la orden. Verifica los datos.");
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Crear Nueva Orden</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información de la Orden */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Información de la Orden</h2>
            
            <Select
              label="Mesa"
              value={form.table_id}
              onChange={(e) => setForm({ ...form, table_id: e.target.value })}
              options={[
                { value: "", label: "-- Sin mesa (Para llevar) --" },
                ...tables
                  .filter(table => table.status === 'disponible')
                  .map((t) => ({ value: t.id, label: `${t.name} (${t.seats} pers.)` })),
              ]}
            />

            <Select
              label="Cliente"
              value={form.customer_id}
              onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
              options={[
                { value: "", label: "-- Cliente walk-in --" },
                ...customers.map((c) => ({ 
                  value: c.id, 
                  label: `${c.first_name} ${c.last_name}` 
                })),
              ]}
            />

            <Input
              label="Notas"
              name="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Observaciones adicionales..."
            />
          </div>

          {/* Items de la Orden */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Items del Pedido</h2>
            
            {/* Buscador */}
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                placeholder="Buscar items por nombre o categoría..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Lista de Items Agregados */}
            <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
              <h3 className="font-semibold mb-3">Items en la orden:</h3>
              
              {form.items.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay items agregados</p>
              ) : (
                <div className="space-y-2">
                  {form.items.map((item) => (
                    <div key={item.menu_item_id} className="flex justify-between items-center border-b pb-2">
                      <div className="flex-1">
                        <p className="font-medium">{item.menu_item.name}</p>
                        <p className="text-sm text-gray-600">${item.price} c/u</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(item.menu_item_id, item.quantity - 1)}
                          className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(item.menu_item_id, item.quantity + 1)}
                          className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center"
                        >
                          +
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => removeItem(item.menu_item_id)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total */}
              {form.items.length > 0 && (
                <div className="mt-4 pt-2 border-t">
                  <p className="font-semibold text-lg">
                    Total: ${calculateTotal().toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Menú de Items Disponibles */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Agregar Items del Menú</h3>
          
          {filteredMenuItems.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No se encontraron items</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto p-2">
              {filteredMenuItems.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => addItem(item)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">{item.category?.name || "Sin categoría"}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${Number(item.price).toFixed(2)}</p>
                      <button
                        type="button"
                        className="mt-1 bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/orders")}
          >
            Cancelar
          </Button>
          <Button 
            type="submit"
            disabled={form.items.length === 0}
          >
            Crear Orden
          </Button>
        </div>
      </form>
    </div>
  );
}