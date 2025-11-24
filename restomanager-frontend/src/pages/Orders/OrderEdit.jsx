import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ordersAPI from "../../api/orders";
import tablesAPI from "../../api/tables";
import customersAPI from "../../api/customers";
import usersAPI from "../../api/users";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

export default function OrderEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tables, setTables] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    table_id: "",
    customer_id: "",
    user_id: "",
    status: "",
    notes: "",
  });

  const loadData = async () => {
    try {
      const [order, t, c, u] = await Promise.all([
        ordersAPI.getById(id),
        tablesAPI.getAll(),
        customersAPI.getAll(),
        usersAPI.getAll()
      ]);

      const orderData = order.data;

      setTables(t.data);
      setCustomers(c.data);
      setUsers(u.data);

      setForm({
        table_id: orderData.table_id || "",
        customer_id: orderData.customer_id || "",
        user_id: orderData.user_id || "",
        status: orderData.status || "pendiente",
        notes: orderData.notes || "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await ordersAPI.update(id, form);
      navigate("/orders");
    } catch (error) {
      console.error("Error actualizando orden:", error);
      alert("Error al actualizar la orden. Verifica los datos.");
    }
  };

  if (loading) return <p className="p-6 text-lg">Cargando...</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Editar Orden #{id}</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">

        <Select
          label="Mesa"
          value={form.table_id}
          onChange={(e) => setForm({ ...form, table_id: e.target.value })}
          options={[
            { value: "", label: "-- Selecciona --" },
            ...tables.map((t) => ({ value: t.id, label: t.name })),
          ]}
        />

        <Select
          label="Cliente"
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

        <div className="flex justify-end gap-3 mt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/orders")}
          >
            Cancelar
          </Button>
          <Button type="submit">Actualizar Orden</Button>
        </div>
      </form>
    </div>
  );
}