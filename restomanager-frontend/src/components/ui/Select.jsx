export default function Select({ label, options = [], ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-medium">{label}</label>}
      <select
        {...props}
        className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
