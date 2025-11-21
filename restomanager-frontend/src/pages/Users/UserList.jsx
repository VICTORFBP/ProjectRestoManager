import { useEffect, useState } from "react";
import usersAPI from "../../api/users";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, PlusCircle, Mail, Shield } from "lucide-react";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const res = await usersAPI.getAll();
            setUsers(res.data);
        } catch (error) {
            console.error("Error cargando usuarios:", error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        try {
            await usersAPI.remove(deleteId);
            setDeleteId(null);
            loadUsers();
        } catch (error) {
            console.error("Error eliminando usuario:", error);
        }
    }; // INICIO DE LA FUNCIÓN CORREGIDA

    const getRoleBadge = (role) => {
        // 1. COMPROBACIÓN: Evita el error si 'role' no es una cadena (es null o undefined).
        if (typeof role !== "string" || !role.trim()) {
            return (
                <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
                    Sin Rol
                </span>
            );
        }

        // 2. LÓGICA NORMAL: Si llegamos aquí, 'role' es una cadena válida.
        const lowerCaseRole = role.toLowerCase();

        const styles = {
            admin: "bg-purple-100 text-purple-800",
            mesero: "bg-blue-100 text-blue-800",
            cocinero: "bg-orange-100 text-orange-800",
            cajero: "bg-green-100 text-green-800",
        };

        // Formatea el nombre del rol (ej: 'admin' -> 'Admin')
        const formattedRoleName =
            lowerCaseRole.charAt(0).toUpperCase() + lowerCaseRole.slice(1);

        // Usa el estilo mapeado o un estilo gris por defecto.
        return (
            <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                    styles[lowerCaseRole] || "bg-gray-100 text-gray-800"
                }`}
            >
                {formattedRoleName}
            </span>
        );
    }; // FIN DE LA FUNCIÓN CORREGIDA
    if (loading) return <div className="p-6">Cargando...</div>;

    return (
        <div className="p-6">
                 {" "}
            <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold">Usuarios</h1>       {" "}
                <Button
                    onClick={() => navigate("/users/create")}
                    variant="primary"
                    className="flex items-center gap-2"
                >
                              <PlusCircle size={18} /> Nuevo Usuario        {" "}
                </Button>
                     {" "}
            </div>
                 {" "}
            <div className="bg-white rounded-xl shadow overflow-hidden">
                       {" "}
                <table className="min-w-full">
                             {" "}
                    <thead className="bg-gray-100 border-b">
                                   {" "}
                        <tr>
                                         {" "}
                            <th className="p-3 text-left">Nombre</th>           
                              <th className="p-3 text-left">Email</th>         
                                <th className="p-3 text-left">Rol</th>         
                                <th className="p-3 text-right">Acciones</th>   
                                   {" "}
                        </tr>
                                 {" "}
                    </thead>
                             {" "}
                    <tbody>
                                   {" "}
                        {users.length === 0 ? (
                            <tr>
                                               {" "}
                                <td colSpan={4} className="text-center py-4">
                                                      No hay usuarios          
                                         {" "}
                                </td>
                                             {" "}
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-gray-50 border-b"
                                >
                                                     {" "}
                                    <td className="py-3 px-4 font-medium">
                                        {user.name}
                                    </td>
                                                     {" "}
                                    <td className="py-3 px-4">
                                                           {" "}
                                        <div className="flex items-center gap-2 text-gray-600">
                                                                 {" "}
                                            <Mail size={16} />                 
                                                {user.email}                   {" "}
                                        </div>
                                                         {" "}
                                    </td>
                                                     {" "}
                                    <td className="py-3 px-4">
                                        {getRoleBadge(user.role)}
                                    </td>
                                                     {" "}
                                    <td className="py-3 px-4 flex justify-end gap-2">
                                                           {" "}
                                        <Button
                                            variant="secondary"
                                            onClick={() =>
                                                navigate(
                                                    `/users/edit/${user.id}`
                                                )
                                            }
                                        >
                                                                 {" "}
                                            <Pencil size={16} />               
                                               {" "}
                                        </Button>
                                                           {" "}
                                        <Button
                                            variant="danger"
                                            onClick={() => setDeleteId(user.id)}
                                        >
                                                                 {" "}
                                            <Trash2 size={16} />               
                                               {" "}
                                        </Button>
                                                         {" "}
                                    </td>
                                                   {" "}
                                </tr>
                            ))
                        )}
                                 {" "}
                    </tbody>
                           {" "}
                </table>
                     {" "}
            </div>
                  {/* Modal de confirmación */}     {" "}  
            <Modal
                open={!!deleteId}
                onClose={() => setDeleteId(null)}
                title="Confirmar eliminación"
            >
                        <p>¿Seguro que deseas eliminar este usuario?</p>       {" "}
                <div className="flex justify-end gap-3 mt-4">
                             {" "}
                    <Button
                        variant="secondary"
                        onClick={() => setDeleteId(null)}
                    >
                                    Cancelar          {" "}
                    </Button>
                             {" "}
                    <Button variant="danger" onClick={confirmDelete}>
                                    Eliminar          {" "}
                    </Button>
                           {" "}
                </div>
                     {" "}
            </Modal>
               {" "}
        </div>
    );
}
