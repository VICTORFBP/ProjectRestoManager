import { useEffect, useState } from "react";
import api from "../api/axios";
import Loader from "../components/ui/Loader";
import StatsCard from "../components/dashboard/StatsCard";
import OrdersChart from "../components/dashboard/OrdersChart";
import RevenueChart from "../components/dashboard/RevenueChart";
import TopItems from "../components/dashboard/TopItems";
import Occupancy from "../components/dashboard/Occupancy";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    try {
      const [oRes, mRes, tRes, cRes] = await Promise.all([
        api.get("/orders"),
        api.get("/menu-items"),
        api.get("/tables"),
        api.get("/customers"),
      ]);
      setOrders(oRes.data);
      setMenuItems(mRes.data);
      setTables(tRes.data);
      setCustomers(cRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  // prepare small datasets
  // orders by created_at date (group)
  const ordersByDayMap = {};
  orders.forEach(o => {
    const d = new Date(o.created_at).toISOString().slice(0,10);
    ordersByDayMap[d] = (ordersByDayMap[d] || 0) + 1;
  });
  const ordersByDay = Object.entries(ordersByDayMap).map(([label,value])=>({ label, value }));

  // revenue by day (sum subtotals from items)
  const revenueMap = {};
  orders.forEach(o => {
    const d = new Date(o.created_at).toISOString().slice(0,10);
    revenueMap[d] = (revenueMap[d] || 0) + Number(o.total || 0);
  });
  const revenueByDay = Object.entries(revenueMap).map(([label,value])=>({ label, value: value.toFixed(2) }));

  // top items (count)
  const itemCount = {};
  orders.forEach(o => {
    (o.items || []).forEach(it => {
      const name = (it.menu_item && it.menu_item.name) || `id:${it.menu_item_id}`;
      itemCount[name] = (itemCount[name] || 0) + Number(it.quantity || 1);
    });
  });
  const topItems = Object.entries(itemCount)
    .map(([name,count])=>({ name, count }))
    .sort((a,b)=>b.count-a.count)
    .slice(0,6);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard avanzado</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Pedidos" value={orders.length} />
        <StatsCard title="Ingresos" value={`$${orders.reduce((s,o)=>s + Number(o.total||0),0).toFixed(2)}`} />
        <StatsCard title="Items en menú" value={menuItems.length} />
        <StatsCard title="Clientes" value={customers.length} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <OrdersChart data={ordersByDay} />
          <RevenueChart data={revenueByDay} />
        </div>

        <div className="space-y-4">
          <TopItems items={topItems} />
          <Occupancy tables={tables} orders={orders} />
        </div>
      </div>
    </div>
  );
}
