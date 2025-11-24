import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Package, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function PedidosCliente() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarMisPedidos();
  }, []);

  const cargarMisPedidos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/my-orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPedidos(data);
      } else {
        console.error('Error cargando pedidos');
      }
    } catch (error) {
      console.error('Error cargando pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pendiente':
        return <Clock className="text-yellow-500" size={20} />;
      case 'completado':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'cancelado':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Package className="text-gray-500" size={20} />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      'pendiente': 'Pendiente',
      'preparando': 'En preparación',
      'servido': 'Servido',
      'completado': 'Completado',
      'cancelado': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-orange-500 border-dashed rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
          <Package className="text-orange-500" />
          Mis Pedidos
        </h1>
        
        {pedidos.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-8 text-center">
            <Package size={64} className="text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-600 mb-2">No tienes pedidos aún</h2>
            <p className="text-gray-500 mb-6">Realiza tu primer pedido desde nuestro menú</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map(pedido => (
              <div key={pedido.id} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(pedido.status)}
                    <div>
                      <h3 className="font-semibold text-lg">Pedido #{pedido.id}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(pedido.created_at).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      pedido.status === 'completado' ? 'bg-green-100 text-green-800' :
                      pedido.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      pedido.status === 'preparando' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {getStatusText(pedido.status)}
                    </span>
                    <p className="text-lg font-bold mt-1">${Number(pedido.total).toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-3">Items del pedido:</h4>
                  <div className="space-y-2">
                    {pedido.items && pedido.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-3">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {item.quantity}x
                          </span>
                          <span>{item.menu_item?.name || 'Item no disponible'}</span>
                        </div>
                        <span className="font-medium">${Number(item.subtotal).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}