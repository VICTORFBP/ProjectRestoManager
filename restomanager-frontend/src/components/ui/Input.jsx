export default function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="font-medium">{label}</label>}
      <input
        {...props}
        className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}
