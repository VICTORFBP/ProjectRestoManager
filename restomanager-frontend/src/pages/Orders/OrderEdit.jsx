import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ordersAPI from "../../api/orders";
import tablesAPI from "../../api/tables";
import customersAPI from "../../api/customers";
import menuItemsAPI from "../../api/menuItems";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";

export default function OrderEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tables, setTables] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    table_id: "",
    customer_id: "",
    status: "",
    items: [],
  });

  const loadData = async () => {
    try {
      const [order, t, c, m] = await Promise.all([
        ordersAPI.getById(id),
        tablesAPI.getAll(),
        customersAPI.getAll(),
        menuItemsAPI.getAll(),
      ]);

      const orderData = order.data;

      setTables(t.data);
      setCustomers(c.data);
      setMenuItems(m.data);

      setForm({
        table_id: orderData.table_id,
        customer_id: orderData.customer_id,
        status: orderData.status,
        items: orderData.items.map((i) => ({
          menu_item_id: i.menu_item_id,
          name: i.menu_item.name,
          price: i.menu_item.price,
        })),
      });
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addItem = (id) => {
    const item = menuItems.find((i) => i.id === Number(id));
    if (!item) return;

    setForm({
      ...form,
      items: [
        ...form.items,
        { menu_item_id: item.id, name: item.name, price: item.price },
      ],
    });
  };

  const removeItem = (index) => {
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    });
  };

  const total = form.items.reduce((sum, i) => sum + Number(i.price), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ordersAPI.update(id, {
        ...form,
        total_amount: total,
      });

      navigate("/orders");
    } catch (error) {
      console.error("Error actualizando orden:", error);
    }
  };

  if (loading) return <p className="p-6 text-lg">Cargando...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Editar Orden #{id}</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <Select
          label="Mesa"
          value={form.table_id}
          onChange={(e) => setForm({ ...form, table_id: e.target.value })}
          options={[
            { value: "", label: "-- Selecciona --" },
            ...tables.map((t) => ({ value: t.id, label: `Mesa ${t.number}` })),
          ]}
        />

        <Select
          label="Cliente"
          value={form.customer_id}
          onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
          options={[
            { value: "", label: "-- Selecciona --" },
            ...customers.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />

        <Select
          label="Estado"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          options={[
            { value: "pending", label: "Pendiente" },
            { value: "preparing", label: "Preparando" },
            { value: "served", label: "Servido" },
            { value: "completed", label: "Completado" },
          ]}
        />

        {/* AGREGAR NUEVO ITEM */}
        <Select
          label="Agregar Item"
          onChange={(e) => addItem(e.target.value)}
          options={[
            { value: "", label: "-- Selecciona un plato --" },
            ...menuItems.map((m) => ({
              value: m.id,
              label: `${m.name} - $${m.price}`,
            })),
          ]}
        />

        {/* LISTA DE ITEMS */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Items</h2>

          <ul className="flex flex-col gap-2">
            {form.items.map((i, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-100 p-3 rounded"
              >
                <span>
                  {i.name} — ${i.price}
                </span>

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-red-600 font-bold"
                >
                  X
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-2xl font-bold mt-2">
          Total: ${total}
        </div>

        <Button type="submit">Actualizar Orden</Button>
      </form>
    </div>
  );
}
