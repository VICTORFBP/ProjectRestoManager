import { useState } from "react";
import tablesAPI from "../../api/tables";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { useNavigate } from "react-router-dom";

export default function TableCreate() {
  const [form, setForm] = useState({
    number: "",
    capacity: "",
    status: "disponible",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tablesAPI.create(form);
      navigate("/tables");
    } catch (error) {
      console.error("Error creando mesa:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Agregar Nueva Mesa</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Número de Mesa"
            type="number"
            name="number"
            value={form.number}
            onChange={handleChange}
            placeholder="Ej: 1"
            required
          />

          <Input
            label="Capacidad (personas)"
            type="number"
            name="capacity"
            value={form.capacity}
            onChange={handleChange}
            placeholder="Ej: 4"
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

            <Button type="submit">Guardar Mesa</Button>
          </div>
        </form>
      </div>
    </div>
  );
}