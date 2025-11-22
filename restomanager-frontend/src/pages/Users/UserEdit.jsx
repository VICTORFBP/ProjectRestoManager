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
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role_id: "",
    is_active: true
  });

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
    loadRoles();
  }, []);

  const loadUser = async () => {
    try {
      const res = await usersAPI.getById(id);
      setForm({
        username: res.data.username,
        first_name: res.data.first_name,
        last_name: res.data.last_name,
        email: res.data.email,
        password: "",
        role_id: res.data.role_id,
        is_active: res.data.is_active
      });
    } catch (error) {
      console.error("Error cargando usuario:", error);
    } finally {
      setLoading(false);
    }
  };

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
      const dataToSend = { ...form };
      
      // Si el password está vacío, no lo enviamos
      if (!dataToSend.password) {
        delete dataToSend.password;
      }

      await usersAPI.update(id, dataToSend);
      navigate("/users");
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      alert("Error al actualizar usuario. Verifica los datos.");
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Cargando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Editar Usuario</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <Input
            label="Username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <Input
            label="Nombre"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
          />

          <Input
            label="Apellido"
            name="last_name"
            value={form.last_name}
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

            <Button type="submit">Actualizar Usuario</Button>
          </div>
        </form>
      </div>
    </div>
  );
}