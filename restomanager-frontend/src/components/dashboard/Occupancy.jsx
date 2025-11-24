export default function Occupancy({ tables = [], orders = [] }) {
  const total = tables.length || 1;
  const occupied = tables.filter(t => t.status === 'ocupada').length;
  const pct = Math.round((occupied / total) * 100);
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold">Ocupación mesas</h3>
      <div className="text-2xl font-bold mt-2">{pct}%</div>
      <div className="text-xs text-gray-500 mt-1">{occupied} de {total} mesas ocupadas</div>
      <div className="w-full h-2 bg-gray-200 rounded mt-3">
        <div style={{ width: `${pct}%` }} className="h-full bg-blue-500 rounded" />
      </div>
    </div>
  );
}
