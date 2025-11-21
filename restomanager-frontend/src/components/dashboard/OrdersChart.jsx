export default function OrdersChart({ data = [] /* [{label:'2025-11-01', value:3}, ...] */ }) {
  if (!data.length) return <div className="p-4">No hay datos</div>;

  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-3">Pedidos por día</h3>
      <div className="flex gap-2 items-end h-40">
        {data.map((d, i) => {
          const h = Math.round((d.value / max) * 100);
          return (
            <div key={i} className="flex-1 text-center">
              <div style={{ height: `${h}%` }} className="bg-blue-500 rounded-t transition-all" />
              <div className="text-xs mt-1">{d.value}</div>
              <div className="text-xs text-gray-500">{d.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
