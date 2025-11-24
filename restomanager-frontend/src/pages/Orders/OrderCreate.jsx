import { useEffect, useState } from "react";
import ordersAPI from "../../api/orders";
import tablesAPI from "../../api/tables";
import customersAPI from "../../api/customers";
import menuItemsAPI from "../../api/menuItems";
import usersAPI from "../../api/users";
import Select from "../../components/ui/Select";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { useNavigate } from "react-router-dom";
import { Trash2, Search, Plus, Clock, Users, User } from "lucide-react";

export default function OrderCreate() {
    const navigate = useNavigate();

    const [tables, setTables] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [users, setUsers] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({
        table_id: "",
        customer_id: "",
        user_id: "",
        status: "pendiente",
        notes: "",
        items: [],
    });

    // Estados para búsqueda y filtros
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [showQuickAdd, setShowQuickAdd] = useState(false);

    const loadData = async () => {
        try {
            const [t, c, u, m] = await Promise.all([
                tablesAPI.getAll(),
                customersAPI.getAll(),
                usersAPI.getAll(),
                menuItemsAPI.getAll(),
            ]);

            setTables(t.data);
            setCustomers(c.data);
            setUsers(u.data);
            setMenuItems(m.data);
        } catch (error) {
            console.error("Error cargando datos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // Obtener categorías únicas
    const categories = ["all", ...new Set(menuItems.map(item => item.category?.name).filter(Boolean))];

    // Filtrar items del menú
    const filteredMenuItems = menuItems.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.category?.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" || item.category?.name === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Items populares (podrías ordenar por algo como "más vendidos" en el futuro)
    const popularItems = menuItems.slice(0, 6);

    // Función para agregar item rápido
    const addItemQuick = (item) => {
        // Verificar si el item ya está en la orden
        const existingItemIndex = form.items.findIndex(
            orderItem => orderItem.menu_item_id === item.id
        );

        if (existingItemIndex >= 0) {
            // Incrementar cantidad si ya existe
            const newItems = [...form.items];
            newItems[existingItemIndex].quantity += 1;
            setForm({ ...form, items: newItems });
        } else {
            // Agregar nuevo item
            setForm({
                ...form,
                items: [
                    ...form.items,
                    {
                        menu_item_id: item.id,
                        quantity: 1,
                        special_instructions: "",
                    },
                ],
            });
        }
        setShowQuickAdd(false);
    };

    const addItem = (menuItemId) => {
        const item = menuItems.find((i) => i.id === Number(menuItemId));
        if (!item) return;

        setForm({
            ...form,
            items: [
                ...form.items,
                {
                    menu_item_id: item.id,
                    quantity: 1,
                    special_instructions: "",
                },
            ],
        });
    };

    const removeItem = (index) => {
        setForm({
            ...form,
            items: form.items.filter((_, i) => i !== index),
        });
    };

    const updateItemQuantity = (index, quantity) => {
        if (quantity < 1) return;
        const newItems = [...form.items];
        newItems[index].quantity = Number(quantity);
        setForm({ ...form, items: newItems });
    };

    const updateItemInstructions = (index, instructions) => {
        const newItems = [...form.items];
        newItems[index].special_instructions = instructions;
        setForm({ ...form, items: newItems });
    };

    const calculateTotal = () => {
        return form.items.reduce((sum, orderItem) => {
            const menuItem = menuItems.find(
                (m) => m.id === orderItem.menu_item_id
            );
            return sum + (menuItem ? menuItem.price * orderItem.quantity : 0);
        }, 0);
    };

    const clearForm = () => {
        setForm({
            table_id: "",
            customer_id: "",
            user_id: "",
            status: "pendiente",
            notes: "",
            items: [],
        });
        setSearchTerm("");
        setSelectedCategory("all");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.items.length === 0) {
            alert("Debes agregar al menos un item a la orden");
            return;
        }

        if (!form.table_id) {
            alert("Debes seleccionar una mesa");
            return;
        }

        try {
            await ordersAPI.create(form);
            alert("¡Orden creada exitosamente!");
            clearForm();
            navigate("/orders");
        } catch (error) {
            console.error("Error creando orden:", error);
            alert("Error al crear la orden. Verifica los datos.");
        }
    };

    if (loading) {
        return (
            <div className="p-6 max-w-3xl mx-auto">
                <div className="flex justify-center items-center min-h-64">
                    <div className="text-center">
                        <div className="w-8 h-8 border-2 border-blue-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
                        <p>Cargando datos...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Crear Nueva Orden</h1>
                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={clearForm}
                    >
                        Limpiar
                    </Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate("/orders")}
                    >
                        Volver a Órdenes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Formulario Principal */}
                <div className="lg:col-span-2">
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-xl shadow p-6 flex flex-col gap-4"
                    >
                        {/* Información Básica */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                label="Mesa *"
                                name="table_id"
                                value={form.table_id}
                                onChange={(e) =>
                                    setForm({ ...form, table_id: e.target.value })
                                }
                                options={[
                                    { value: "", label: "-- Selecciona mesa --" },
                                    ...tables.map((t) => ({ 
                                        value: t.id, 
                                        label: `${t.name} (${t.seats} pers.) - ${t.status}` 
                                    })),
                                ]}
                            />

                            <Select
                                label="Cliente"
                                name="customer_id"
                                value={form.customer_id}
                                onChange={(e) =>
                                    setForm({ ...form, customer_id: e.target.value })
                                }
                                options={[
                                    { value: "", label: "-- Cliente walk-in --" },
                                    ...customers.map((c) => ({
                                        value: c.id,
                                        label: `${c.first_name} ${c.last_name}`,
                                    })),
                                ]}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Select
                                label="Mesero *"
                                name="user_id"
                                value={form.user_id}
                                onChange={(e) =>
                                    setForm({ ...form, user_id: e.target.value })
                                }
                                options={[
                                    { value: "", label: "-- Selecciona mesero --" },
                                    ...users.filter(u => u.role?.name === 'Mesero').map((u) => ({
                                        value: u.id,
                                        label: `${u.first_name} ${u.last_name}`,
                                    })),
                                ]}
                            />

                            <Select
                                label="Estado"
                                name="status"
                                value={form.status}
                                onChange={(e) =>
                                    setForm({ ...form, status: e.target.value })
                                }
                                options={[
                                    { value: "pendiente", label: "⏳ Pendiente" },
                                    { value: "preparando", label: "👨‍🍳 En preparación" },
                                    { value: "servido", label: "🍽️ Servido" },
                                    { value: "completado", label: "✅ Completado" },
                                ]}
                            />
                        </div>

                        <Input
                            label="Notas especiales"
                            name="notes"
                            value={form.notes}
                            onChange={(e) =>
                                setForm({ ...form, notes: e.target.value })
                            }
                            placeholder="Alergias, preferencias, instrucciones especiales..."
                        />

                        {/* Sección de Items */}
                        <div className="border-t pt-4 mt-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold">
                                    Items del Pedido
                                </h2>
                                <Button
                                    type="button"
                                    onClick={() => setShowQuickAdd(!showQuickAdd)}
                                    variant="secondary"
                                    className="flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    {showQuickAdd ? "Ocultar Menú" : "Agregar Rápido"}
                                </Button>
                            </div>

                            {/* Búsqueda Rápida */}
                            {showQuickAdd && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="flex gap-3 mb-4">
                                        <div className="flex-1">
                                            <Input
                                                label="Buscar en el menú"
                                                placeholder="Buscar por nombre o categoría..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                icon={<Search size={16} />}
                                            />
                                        </div>
                                    </div>

                                    {/* Filtros de Categoría */}
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium mb-2">
                                            Filtrar por categoría:
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {categories.map(category => (
                                                <button
                                                    key={category}
                                                    type="button"
                                                    onClick={() => setSelectedCategory(category)}
                                                    className={`px-3 py-1 rounded-full text-sm transition ${
                                                        selectedCategory === category
                                                            ? "bg-blue-600 text-white"
                                                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                                    }`}
                                                >
                                                    {category === "all" ? "Todas" : category}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Items Populares */}
                                    {searchTerm === "" && selectedCategory === "all" && (
                                        <div className="mb-4">
                                            <h4 className="font-medium mb-2 text-gray-700">
                                                Items Populares
                                            </h4>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                                {popularItems.map(item => (
                                                    <button
                                                        key={item.id}
                                                        type="button"
                                                        onClick={() => addItemQuick(item)}
                                                        className="p-3 bg-white border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition text-left"
                                                    >
                                                        <div className="font-medium text-sm">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-green-600 font-semibold">
                                                            ${item.price}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {item.category?.name}
                                                        </div>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Resultados de Búsqueda */}
                                    <div>
                                        <h4 className="font-medium mb-2 text-gray-700">
                                            {searchTerm || selectedCategory !== "all" 
                                                ? "Resultados de búsqueda" 
                                                : "Todo el menú"}
                                        </h4>
                                        <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                                            {filteredMenuItems.length === 0 ? (
                                                <p className="text-gray-500 text-center py-4">
                                                    No se encontraron items
                                                </p>
                                            ) : (
                                                filteredMenuItems.map(item => (
                                                    <button
                                                        key={item.id}
                                                        type="button"
                                                        onClick={() => addItemQuick(item)}
                                                        className="flex justify-between items-center p-3 bg-white border rounded-lg hover:bg-blue-50 hover:border-blue-300 transition"
                                                    >
                                                        <div className="text-left">
                                                            <div className="font-medium">
                                                                {item.name}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                {item.category?.name}
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-green-600 font-semibold">
                                                                ${item.price}
                                                            </div>
                                                        </div>
                                                    </button>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Select tradicional */}
                            {!showQuickAdd && (
                                <Select
                                    label="Agregar item del menú"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            addItem(e.target.value);
                                            e.target.value = "";
                                        }
                                    }}
                                    options={[
                                        { value: "", label: "-- Selecciona un plato --" },
                                        ...menuItems.map((m) => ({
                                            value: m.id,
                                            label: `${m.name} - $${m.price} (${m.category?.name || 'Sin categoría'})`,
                                        })),
                                    ]}
                                />
                            )}

                            {/* Items agregados */}
                            {form.items.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 rounded-lg">
                                    <Clock size={48} className="text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600">No hay items en la orden</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Usa el buscador o el selector para agregar items
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-4 space-y-3">
                                    {form.items.map((orderItem, index) => {
                                        const menuItem = menuItems.find(
                                            (m) => m.id === orderItem.menu_item_id
                                        );
                                        const subtotal = menuItem
                                            ? menuItem.price * orderItem.quantity
                                            : 0;

                                        return (
                                            <div
                                                key={index}
                                                className="bg-white border p-4 rounded-lg flex gap-3 items-start hover:shadow-md transition"
                                            >
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div className="font-medium text-lg">
                                                            {menuItem?.name}
                                                        </div>
                                                        <div className="text-right">
                                                            <div className="text-green-600 font-semibold">
                                                                ${subtotal.toFixed(2)}
                                                            </div>
                                                            <div className="text-sm text-gray-600">
                                                                ${menuItem?.price} x {orderItem.quantity}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <div className="flex items-center gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => updateItemQuantity(index, orderItem.quantity - 1)}
                                                                className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-12 text-center font-medium">
                                                                {orderItem.quantity}
                                                            </span>
                                                            <button
                                                                type="button"
                                                                onClick={() => updateItemQuantity(index, orderItem.quantity + 1)}
                                                                className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300"
                                                            >
                                                                +
                                                            </button>
                                                        </div>

                                                        <Input
                                                            placeholder="Instrucciones especiales..."
                                                            value={orderItem.special_instructions}
                                                            onChange={(e) =>
                                                                updateItemInstructions(
                                                                    index,
                                                                    e.target.value
                                                                )
                                                            }
                                                            className="flex-1"
                                                        />
                                                    </div>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                                                    title="Eliminar item"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Resumen y Total */}
                            {form.items.length > 0 && (
                                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex justify-between items-center text-lg">
                                        <div>
                                            <span className="font-semibold">
                                                {form.items.reduce((sum, item) => sum + item.quantity, 0)} 
                                                {" "}items en la orden
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-blue-600">
                                                Total: ${calculateTotal().toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Botones de Acción */}
                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate("/orders")}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                type="submit"
                                disabled={form.items.length === 0 || !form.table_id}
                            >
                                Crear Orden - ${calculateTotal().toFixed(2)}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Panel Lateral - Información útil */}
                <div className="space-y-6">
                    {/* Resumen de Mesas */}
                    <div className="bg-white rounded-xl shadow p-4">
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Users size={18} />
                            Estado de Mesas
                        </h3>
                        <div className="space-y-2">
                            {tables.slice(0, 5).map(table => (
                                <div key={table.id} className="flex justify-between items-center text-sm">
                                    <span className="font-medium">{table.name}</span>
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        table.status === 'disponible' 
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {table.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Items más vendidos */}
                    <div className="bg-white rounded-xl shadow p-4">
                        <h3 className="font-semibold mb-3">Items Populares</h3>
                        <div className="space-y-2">
                            {popularItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <span className="truncate">{item.name}</span>
                                    <span className="text-green-600 font-semibold">${item.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Información rápida */}
                    <div className="bg-blue-50 rounded-xl shadow p-4">
                        <h3 className="font-semibold mb-2 text-blue-800">💡 Consejos Rápidos</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Usa el buscador para items frecuentes</li>
                            <li>• Verifica alergias en las notas</li>
                            <li>• Confirma la mesa antes de enviar</li>
                            <li>• Revisa instrucciones especiales</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}