import { useEffect, useState } from "react";
import usersAPI from "../../api/users";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, PlusCircle, Mail } from "lucide-react";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await usersAPI.getAll();
      if (res && Array.isArray(res.data)) {
        setUsers(res.data);
        console.log("Usuarios cargados:", res.data);
      } else {
        setError("Respuesta inválida del servidor.");
        setUsers([]);
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setError("Error al cargar usuarios. Intenta nuevamente.");
      setUsers([]);
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
      setError("Error al eliminar usuario. Intenta nuevamente.");
    }
  };

  const getRoleBadge = (roleName) => {
    if (!roleName) {
      return (
        <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs font-medium">
          Sin Rol
        </span>
      );
    }
    
    const lowerCaseRole = roleName.toLowerCase();
    const styles = {
      administrador: "bg-purple-100 text-purple-800",
      mesero: "bg-blue-100 text-blue-800",
      cocinero: "bg-orange-100 text-orange-800",
      cliente: "bg-green-100 text-green-800",
    };
    
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          styles[lowerCaseRole] || "bg-gray-100 text-gray-800"
        }`}
      >
        {roleName}
      </span>
    );
  };

  if (loading)
    return <div className="p-6 text-center text-lg font-medium">Cargando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Usuarios</h1>
        <Button
          onClick={() => navigate("/users/create")}
          variant="primary"
          className="flex items-center gap-2"
        >
          <PlusCircle size={18} /> Nuevo Usuario
        </Button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Nombre</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Rol</th>
              <th className="p-3 text-left">Activo</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  No hay usuarios
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 border-b">
                  <td className="py-3 px-4 font-medium">{user.username}</td>
                  <td className="py-3 px-4">
                    {user.first_name} {user.last_name}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} />
                      {user.email}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {getRoleBadge(user.role?.name)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.is_active 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="py-3 px-4 flex justify-end gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => navigate(`/users/edit/${user.id}`)}
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => setDeleteId(user.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirmar eliminación"
      >
        <p>¿Seguro que deseas eliminar este usuario?</p>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  );
}