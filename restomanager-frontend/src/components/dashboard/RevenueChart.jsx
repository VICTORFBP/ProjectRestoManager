function pathFromPoints(points, w, h, padding = 10) {
  const max = Math.max(...points.map(p => p.y), 1);
  const stepX = (w - padding*2) / Math.max(points.length - 1, 1);
  return points.map((p,i) => {
    const x = padding + i * stepX;
    const y = h - padding - (p.y / max) * (h - padding*2);
    return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
}

export default function RevenueChart({ data = [] /* [{label, value}] */ }) {
  if (!data.length) return <div className="p-4">No hay datos</div>;
  const w = 600, h = 140;
  const points = data.map(d => ({ x:0, y: Number(d.value) }));
  const path = pathFromPoints(points, w, h);
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-semibold mb-3">Ingresos diarios</h3>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height="160">
        <path d={path} stroke="#10b981" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="flex gap-4 mt-2 text-xs text-gray-600">
        {data.slice(0,5).map((d,i)=> <div key={i}>{d.label}: ${d.value}</div>)}
      </div>
    </div>
  );
}
