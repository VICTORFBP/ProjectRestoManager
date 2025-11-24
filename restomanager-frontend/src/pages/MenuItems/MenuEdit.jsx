import { useState, useEffect } from "react";
import menuItemsAPI from "../../api/menuItems";
import categoriesAPI from "../../api/categories";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Select from "../../components/ui/Select";
import { useNavigate, useParams } from "react-router-dom";

export default function MenuEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    category_id: "",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadItem();
    loadCategories();
  }, []);

  const loadItem = async () => {
    try {
      const res = await menuItemsAPI.getById(id);
      setForm(res.data);
    } catch (error) {
      console.error("Error cargando ítem:", error);
    }
  };

  const loadCategories = async () => {
    const res = await categoriesAPI.getAll();
    setCategories(res.data);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await menuItemsAPI.update(id, form);
      navigate("/menu-items");
    } catch (error) {
      console.error("Error actualizando ítem:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">

      <div className="bg-white rounded-xl shadow p-6">
        <h1 className="text-3xl font-bold mb-6">Editar Plato</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          <Input
            label="Nombre del plato"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Precio"
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            required
          />

          <Select
            label="Categoría"
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            required
            options={[
              { value: "", label: "-- Seleccione categoría --" },
              ...categories.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/menu-items")}
            >
              Cancelar
            </Button>

            <Button type="submit">Actualizar Plato</Button>
          </div>

        </form>

      </div>
    </div>
  );
}
