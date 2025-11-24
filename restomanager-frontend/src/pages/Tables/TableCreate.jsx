import { useState } from "react";
import tablesAPI from "../../api/tables";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { useNavigate } from "react-router-dom";

export default function TableCreate() {
  const [form, setForm] = useState({
    name: "",
    seats: "",
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
      alert("Error al crear mesa. Verifica los datos.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Agregar Nueva Mesa</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Nombre de la Mesa"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej: Mesa 1"
            required
          />

          <Input
            label="Asientos (personas)"
            type="number"
            name="seats"
            value={form.seats}
            onChange={handleChange}
            placeholder="Ej: 4"
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

            <Button type="submit">Guardar Mesa</Button>
          </div>
        </form>
      </div>
    </div>
  );
}