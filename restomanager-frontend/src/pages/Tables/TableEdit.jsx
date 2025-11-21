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
    number: "",
    capacity: "",
    status: "disponible",
  });

  useEffect(() => {
    loadTable();
  }, []);

  const loadTable = async () => {
    try {
      const res = await tablesAPI.getById(id);
      setForm(res.data);
    } catch (error) {
      console.error("Error cargando mesa:", error);
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
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Editar Mesa</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Número de Mesa"
            type="number"
            name="number"
            value={form.number}
            onChange={handleChange}
            required
          />

          <Input
            label="Capacidad (personas)"
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
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