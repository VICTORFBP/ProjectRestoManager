import { useState, useEffect } from "react";
import tablesAPI from "../../api/tables";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { useNavigate, useParams } from "react-router-dom";

export default function TableEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    seats: "",
    status: "disponible",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTable();
  }, []);

  const loadTable = async () => {
    try {
      const res = await tablesAPI.getById(id);
      setForm(res.data);
    } catch (error) {
      console.error("Error cargando mesa:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tablesAPI.update(id, form);
      navigate("/tables");
    } catch (error) {
      console.error("Error actualizando mesa:", error);
      alert("Error al actualizar mesa. Verifica los datos.");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Editar Mesa</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Nombre de la Mesa"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Asientos (personas)"
            type="number"
            name="seats"
            value={form.seats}
            onChange={handleChange}
            min="1"
            required
          />

          <Select
            label="Estado"
            name="status"
            value={form.status}
            onChange={handleChange}
            required
            options={[
              { value: "disponible", label: "Disponible" },
              { value: "ocupada", label: "Ocupada" },
              { value: "reservada", label: "Reservada" },
            ]}
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/tables")}
            >
              Cancelar
            </Button>

            <Button type="submit">Actualizar Mesa</Button>
          </div>
        </form>
      </div>
    </div>
  );
}