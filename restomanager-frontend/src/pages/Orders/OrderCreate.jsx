import { useEffect, useState } from "react";
import ordersAPI from "../../api/orders";
import tablesAPI from "../../api/tables";
import customersAPI from "../../api/customers";
import menuItemsAPI from "../../api/menuItems";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

export default function OrderCreate() {
  const navigate = useNavigate();

  const [tables, setTables] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  const [form, setForm] = useState({
    table_id: "",
    customer_id: "",
    status: "pending",
    items: [],
  });

  const loadData = async () => {
    const t = await tablesAPI.getAll();
    const c = await customersAPI.getAll();
    const m = await menuItemsAPI.getAll();

    setTables(t.data);
    setCustomers(c.data);
    setMenuItems(m.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const addItem = (id) => {
    const item = menuItems.find((i) => i.id === Number(id));
    if (!item) return;

    setForm({
      ...form,
      items: [...form.items, { menu_item_id: item.id, name: item.name, price: item.price }],
    });
  };

  const total = form.items.reduce((sum, item) => sum + Number(item.price), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ordersAPI.create({
        ...form,
        total_amount: total,
      });
      navigate("/orders");
    } catch (error) {
      console.error("Error creando orden:", error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Crear Orden</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <Select
          label="Mesa"
          name="table_id"
          required
          onChange={(e) => setForm({ ...form, table_id: e.target.value })}
          options={[
            { value: "", label: "-- Selecciona --" },
            ...tables.map((t) => ({ value: t.id, label: `Mesa ${t.number}` })),
          ]}
        />

        <Select
          label="Cliente"
          name="customer_id"
          required
          onChange={(e) => setForm({ ...form, customer_id: e.target.value })}
          options={[
            { value: "", label: "-- Selecciona --" },
            ...customers.map((c) => ({ value: c.id, label: c.name })),
          ]}
        />

        <Select
          label="Agregar Item"
          onChange={(e) => addItem(e.target.value)}
          options={[
            { value: "", label: "-- Selecciona un plato --" },
            ...menuItems.map((m) => ({ value: m.id, label: `${m.name} - $${m.price}` })),
          ]}
        />

        <div>
          <h2 className="text-xl font-semibold mb-2">Items</h2>
          {form.items.length === 0 && <p className="text-gray-600">No hay items aún.</p>}

          <ul className="list-disc pl-6">
            {form.items.map((i, index) => (
              <li key={index}>
                {i.name} — ${i.price}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-2xl font-bold">Total: ${total}</div>

        <Button type="submit">Crear Orden</Button>
      </form>
    </div>
  );
}
