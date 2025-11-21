import { useState } from "react";
import usersAPI from "../../api/users";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { useNavigate } from "react-router-dom";

export default function UserCreate() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "mesero",
  });

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await usersAPI.create(form);
      navigate("/users");
    } catch (error) {
      console.error("Error creando usuario:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Agregar Nuevo Usuario</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Nombre completo"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej: Juan Pérez"
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Ej: juan@restaurant.com"
            required
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Mínimo 6 caracteres"
            required
          />

          <Select
            label="Rol"
            name="role"
            value={form.role}
            onChange={handleChange}
            required
            options={[
              { value: "admin", label: "Administrador" },
              { value: "mesero", label: "Mesero" },
              { value: "cocinero", label: "Cocinero" },
              { value: "cajero", label: "Cajero" },
            ]}
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/users")}
            >
              Cancelar
            </Button>

            <Button type="submit">Guardar Usuario</Button>
          </div>
        </form>
      </div>
    </div>
  );
}