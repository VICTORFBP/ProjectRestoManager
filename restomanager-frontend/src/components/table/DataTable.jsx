export default function DataTable({ columns, data }) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full border border-gray-300 rounded">
        <thead>
          <tr className="bg-gray-100">
            {columns.map((col) => (
              <th
                key={col}
                className="py-2 px-4 border text-gray-700 text-left"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center py-4 text-gray-500">
                No hay datos
              </td>
            </tr>
          ) : (
            data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {Object.values(row).map((value, i) => (
                  <td
                    key={i}
                    className="py-2 px-4 border text-gray-800"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
