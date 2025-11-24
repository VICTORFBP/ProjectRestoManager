import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from "lucide-react";

export default function Carrito() {
    const [carrito, setCarrito] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const carritoGuardado = localStorage.getItem("carrito");
        if (carritoGuardado) {
            setCarrito(JSON.parse(carritoGuardado));
        }
    }, []);

    const actualizarCantidad = (id, nuevaCantidad) => {
        if (nuevaCantidad < 1) return;
        
        const nuevoCarrito = carrito.map(item =>
            item.id === id ? { ...item, quantity: nuevaCantidad } : item
        );
        setCarrito(nuevoCarrito);
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    };

    const eliminarItem = (id) => {
        const nuevoCarrito = carrito.filter(item => item.id !== id);
        setCarrito(nuevoCarrito);
        localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    };

    const calcularTotal = () => {
        return carrito.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const realizarPedido = () => {
        // Aquí iría la lógica para enviar el pedido al backend
        alert("Pedido realizado! (Funcionalidad por implementar)");
        localStorage.removeItem("carrito");
        setCarrito([]);
        navigate("/my-orders");
    };

    if (carrito.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-4xl mx-auto">
                    <button 
                        onClick={() => navigate("/menu")}
                        className="flex items-center gap-2 text-orange-500 mb-6"
                    >
                        <ArrowLeft size={20} />
                        Volver al Menú
                    </button>
                    
                    <div className="bg-white rounded-xl shadow p-8 text-center">
                        <ShoppingCart size={64} className="text-gray-400 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-600 mb-2">Carrito Vacío</h2>
                        <p className="text-gray-500 mb-6">Agrega algunos platillos deliciosos a tu carrito</p>
                        <button 
                            onClick={() => navigate("/menu")}
                            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition"
                        >
                            Ver Menú
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate("/menu")}
                    className="flex items-center gap-2 text-orange-500 mb-6"
                >
                    <ArrowLeft size={20} />
                    Volver al Menú
                </button>

                <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <ShoppingCart className="text-orange-500" />
                    Mi Carrito
                </h1>

                <div className="bg-white rounded-xl shadow overflow-hidden">
                    {carrito.map((item) => (
                        <div key={item.id} className="border-b p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                                    {item.image_url ? (
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                                    ) : (
                                        <span className="text-gray-400 text-sm">Imagen</span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    <p className="text-gray-600">${item.price} c/u</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={() => actualizarCantidad(item.id, item.quantity - 1)}
                                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                                    <button 
                                        onClick={() => actualizarCantidad(item.id, item.quantity + 1)}
                                        className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>

                                <div className="w-24 text-right font-semibold">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>

                                <button 
                                    onClick={() => eliminarItem(item.id)}
                                    className="text-red-500 hover:text-red-700 p-2"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}

                    <div className="p-6 bg-gray-50">
                        <div className="flex justify-between items-center text-xl font-bold">
                            <span>Total:</span>
                            <span>${calcularTotal().toFixed(2)}</span>
                        </div>
                        
                        <button 
                            onClick={realizarPedido}
                            className="w-full mt-4 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition font-semibold"
                        >
                            Realizar Pedido
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}