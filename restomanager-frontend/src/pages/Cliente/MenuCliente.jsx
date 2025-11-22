import { useEffect, useState } from "react";
import menuItemsAPI from "../../api/menuItems";
import { ShoppingCart, ChefHat } from "lucide-react";

export default function MenuCliente() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadMenu();
  }, []);

  const loadMenu = async () => {
    try {
      const res = await menuItemsAPI.getAll();
      setItems(res.data);
    } catch (error) {
      console.error("Error cargando menú:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["all", ...new Set(items.map(i => i.category?.name).filter(Boolean))];

  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter(i => i.category?.name === selectedCategory);

  if (loading) {
    return <div className="p-6 text-center">Cargando menú...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <ChefHat className="text-orange-500" size={40} />
          Nuestro Menú
        </h1>
        <p className="text-gray-600">Descubre nuestros deliciosos platillos</p>
      </div>

      {/* Filtro de categorías */}
      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
              selectedCategory === cat
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            {cat === "all" ? "Todos" : cat}
          </button>
        ))}
      </div>

      {/* Grid de items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
            <div className="h-48 bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center">
              <ChefHat size={64} className="text-white opacity-50" />
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                <span className="text-2xl font-bold text-orange-600">
                  ${Number(item.price).toFixed(2)}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">
                {item.description || "Delicioso platillo preparado con los mejores ingredientes"}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                  {item.category?.name || "General"}
                </span>
                
                <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition">
                  <ShoppingCart size={18} />
                  Ordenar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No hay platillos disponibles en esta categoría
        </div>
      )}
    </div>
  );
}