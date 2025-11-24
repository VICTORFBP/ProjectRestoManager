import { useState, useEffect } from "react";
import usersAPI from "../../api/users";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { useNavigate } from "react-router-dom";

export default function UserCreate() {
  const [form, setForm] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role_id: "",
    is_active: true
  });

  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      const res = await usersAPI.getRoles();
      setRoles(res.data);
    } catch (error) {
      console.error("Error cargando roles:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await usersAPI.create(form);
      navigate("/users");
    } catch (error) {
      console.error("Error creando usuario:", error);
      alert("Error al crear usuario. Verifica los datos.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Agregar Nuevo Usuario</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Ej: juan.perez"
            required
          />

          <Input
            label="Nombre"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="Ej: Juan"
            required
          />

          <Input
            label="Apellido"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Ej: Pérez"
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
            name="role_id"
            value={form.role_id}
            onChange={handleChange}
            required
            options={[
              { value: "", label: "-- Seleccione un rol --" },
              ...roles.map((r) => ({ value: r.id, label: r.name })),
            ]}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label className="font-medium">Usuario activo</label>
          </div>

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