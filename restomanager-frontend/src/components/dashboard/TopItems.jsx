export default function TopItems({ items = [] }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-3">Top items vendidos</h3>
      <ul className="flex flex-col gap-2">
        {items.length === 0 && <li className="text-sm text-gray-500">Sin datos</li>}
        {items.map((it, idx) => (
          <li key={idx} className="flex justify-between">
            <span>{idx+1}. {it.name}</span>
            <span className="font-medium">{it.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
