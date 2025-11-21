import { useState, useEffect } from "react";
import usersAPI from "../../api/users";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { useNavigate, useParams } from "react-router-dom";

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "mesero",
  });

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const res = await usersAPI.getById(id);
      // No incluir password en el formulario por seguridad
      setForm({
        name: res.data.name,
        email: res.data.email,
        password: "",
        role: res.data.role,
      });
    } catch (error) {
      console.error("Error cargando usuario:", error);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Si el password está vacío, no lo enviamos
      const dataToSend = { ...form };
      if (!dataToSend.password) {
        delete dataToSend.password;
      }

      await usersAPI.update(id, dataToSend);
      navigate("/users");
    } catch (error) {
      console.error("Error actualizando usuario:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Editar Usuario</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Nombre completo"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <Input
            label="Nueva Contraseña (dejar vacío para no cambiar)"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Opcional"
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

            <Button type="submit">Actualizar Usuario</Button>
          </div>
        </form>
      </div>
    </div>
  );
}