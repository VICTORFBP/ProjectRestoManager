import { useEffect, useState } from "react";
import ordersAPI from "../../api/orders";
import tablesAPI from "../../api/tables";
import customersAPI from "../../api/customers";
import menuItemsAPI from "../../api/menuItems";
import usersAPI from "../../api/users";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function OrderCreate() {
  const navigate = useNavigate();

  const [tables, setTables] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [form, setForm] = useState({
    table_id: "",
    customer_id: "",
    user_id: "",
    status: "pendiente",
    notes: "",
    items: [],
  });

  const loadData = async () => {
    try {
      const [t, c, u, m] = await Promise.all([
        tablesAPI.getAll(),
        customersAPI.getAll(),
        usersAPI.getAll(),
        menuItemsAPI.getAll()
      ]);

      setTables(t.data);
      setCustomers(c.data);
      setUsers(u.data);
      setMenuItems(m.data);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addItem = (menuItemId) => {
    const item = menuItems.find((i) => i.id === Number(menuItemId));
    if (!item) return;

    setForm({
      ...form,
      items: [
        ...form.items,
        {
          menu_item_id: item.id,
          quantity: 1,
          special_instructions: ""
        }
      ],
    });
  };

  const removeItem = (index) => {
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index)
    });
  };

  const updateItemQuantity = (index, quantity) => {
    const newItems = [...form.items];
    newItems[index].quantity = Number(quantity);
    setForm({ ...form, items: newItems });
  };

  const updateItemInstructions = (index, instructions) => {
    const newItems = [...form.items];
    newItems[index].special_instructions = instructions;
    setForm({ ...form, items: newItems });
  };

  const calculateTotal = () => {
    return form.items.reduce((sum, orderItem) => {
      const menuItem = menuItems.find(m => m.id === orderItem.menu_item_id);
      return sum + (menuItem ? menuItem.price * orderItem.quantity : 0);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.items.length === 0) {
      alert("Debes agregar al menos un item a la orden");
      return;
    }

    try {
      await ordersAPI.create(form);
      navigate("/orders");
    } catch (error) {
      console.error("Error creando orden:", error);
      alert("Error al crear la orden. Verifica los datos.");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Crear Orden</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">

        <Select
          label="Mesa"
          name="table_id"
          value={form.table_id}
          onChange={(e) => setForm({ ...form, table_id: e.target.value })}
          options={[
            { value: "", label: "-- Selecciona --" },
            ...tables.map((t) => ({ value: t.id, label: t.name })),
          ]}
        />

        <Select
          label="Cliente"
          name="customer_id"
          value={form.customer_id}
          onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
          options={[
            { value: "", label: "-- Selecciona --" },
            ...customers.map((c) => ({ 
              value: c.id, 
              label: `${c.first_name} ${c.last_name}` 
            })),
          ]}
        />

        <Select
          label="Usuario (Mesero)"
          name="user_id"
          value={form.user_id}
          onChange={(e) => setForm({ ...form, user_id: e.target.value })}
          options={[
            { value: "", label: "-- Selecciona --" },
            ...users.map((u) => ({ 
              value: u.id, 
              label: `${u.first_name} ${u.last_name}` 
            })),
          ]}
        />

        <Select
          label="Estado"
          name="status"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          options={[
            { value: "pendiente", label: "Pendiente" },
            { value: "servido", label: "Servido" },
            { value: "completado", label: "Completado" },
            { value: "cancelado", label: "Cancelado" },
          ]}
        />

        <Input
          label="Notas"
          name="notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
          placeholder="Observaciones adicionales..."
        />

        <div className="border-t pt-4 mt-4">
          <h2 className="text-xl font-semibold mb-3">Items del Pedido</h2>

          <Select
            label="Agregar Item"
            onChange={(e) => {
              if (e.target.value) {
                addItem(e.target.value);
                e.target.value = "";
              }
            }}
            options={[
              { value: "", label: "-- Selecciona un plato --" },
              ...menuItems.map((m) => ({ 
                value: m.id, 
                label: `${m.name} - $${m.price}` 
              })),
            ]}
          />

          {form.items.length === 0 ? (
            <p className="text-gray-600 mt-4">No hay items aún.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {form.items.map((orderItem, index) => {
                const menuItem = menuItems.find(m => m.id === orderItem.menu_item_id);
                const subtotal = menuItem ? menuItem.price * orderItem.quantity : 0;

                return (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg flex gap-3 items-start">
                    <div className="flex-1">
                      <div className="font-medium">{menuItem?.name}</div>
                      <div className="text-sm text-gray-600">
                        ${menuItem?.price} x {orderItem.quantity} = ${subtotal.toFixed(2)}
                      </div>
                      
                      <div className="flex gap-2 mt-2">
                        <Input
                          type="number"
                          min="1"
                          value={orderItem.quantity}
                          onChange={(e) => updateItemQuantity(index, e.target.value)}
                          className="w-20"
                        />
                        
                        <Input
                          placeholder="Instrucciones especiales..."
                          value={orderItem.special_instructions}
                          onChange={(e) => updateItemInstructions(index, e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="text-2xl font-bold mt-4 text-right">
            Total: ${calculateTotal().toFixed(2)}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/orders")}
          >
            Cancelar
          </Button>
          <Button type="submit">Crear Orden</Button>
        </div>
      </form>
    </div>
  );
}