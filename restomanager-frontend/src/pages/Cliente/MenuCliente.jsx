import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ShoppingCart, Plus, ChefHat } from "lucide-react";

export default function MenuCliente() {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        cargarMenu();
    }, []);

    const cargarMenu = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/menu-items', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                setMenuItems(data);
                
                // Extraer categorías únicas
                const uniqueCategories = [...new Set(data.map(item => item.category?.name).filter(Boolean))];
                setCategories(uniqueCategories);
            }
        } catch (error) {
            console.error('Error cargando menú:', error);
        } finally {
            setLoading(false);
        }
    };

    const agregarAlCarrito = (item) => {
        if (!user) {
            alert("Debes iniciar sesión para agregar items al carrito");
            navigate("/login");
            return;
        }

        const carritoGuardado = localStorage.getItem("carrito");
        let carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];

        // Verificar si el item ya está en el carrito
        const itemExistente = carrito.find(cartItem => cartItem.id === item.id);
        
        if (itemExistente) {
            // Incrementar cantidad
            carrito = carrito.map(cartItem =>
                cartItem.id === item.id 
                    ? { ...cartItem, quantity: cartItem.quantity + 1 }
                    : cartItem
            );
        } else {
            // Agregar nuevo item
            carrito.push({
                id: item.id,
                name: item.name,
                price: item.price,
                image_url: item.image_url,
                category: item.category,
                quantity: 1
            });
        }

        localStorage.setItem("carrito", JSON.stringify(carrito));
        
        // Mostrar feedback
        alert(`¡${item.name} agregado al carrito!`);
    };

    const itemsFiltrados = selectedCategory === "all" 
        ? menuItems 
        : menuItems.filter(item => item.category?.name === selectedCategory);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-orange-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
                    <p>Cargando menú...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
                        <ChefHat className="text-orange-500" size={36} />
                        Nuestro Menú
                    </h1>
                    
                    <button 
                        onClick={() => navigate("/carrito")}
                        className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition font-semibold flex items-center gap-2"
                    >
                        <ShoppingCart size={20} />
                        Ver Carrito
                    </button>
                </div>

                {/* Filtros de Categorías */}
                {categories.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-3 text-gray-700">Filtrar por categoría:</h2>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setSelectedCategory("all")}
                                className={`px-4 py-2 rounded-full transition ${
                                    selectedCategory === "all" 
                                        ? "bg-orange-500 text-white" 
                                        : "bg-white text-gray-700 hover:bg-gray-100"
                                }`}
                            >
                                Todos
                            </button>
                            {categories.map(category => (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full transition ${
                                        selectedCategory === category 
                                            ? "bg-orange-500 text-white" 
                                            : "bg-white text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Grid de Items */}
                {itemsFiltrados.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No hay items en esta categoría.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {itemsFiltrados.map(item => (
                            <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition">
                                <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                                    {item.image_url ? (
                                        <img 
                                            src={item.image_url} 
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <ChefHat size={48} className="text-gray-400" />
                                    )}
                                </div>
                                
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
                                        <span className="text-orange-500 font-bold">${Number(item.price).toFixed(2)}</span>
                                    </div>
                                    
                                    {item.category && (
                                        <p className="text-sm text-gray-600 mb-3">{item.category.name}</p>
                                    )}
                                    
                                    <button
                                        onClick={() => agregarAlCarrito(item)}
                                        className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-semibold flex items-center justify-center gap-2"
                                    >
                                        <Plus size={18} />
                                        Agregar al Carrito
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}