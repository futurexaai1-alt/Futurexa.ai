export default function SelectedItemsPanel({
  selectedItems,
}: {
  selectedItems: Array<{ id: string | number; title: string; status: string }>;
}) {
  return (
    <div className="mt-4 space-y-2">
      {selectedItems.slice(0, 12).map((item) => (
        <div key={item.id} className="rounded-xl border border-gray-100 bg-white px-4 py-3">
          <p className="text-sm font-semibold text-gray-900">{item.title}</p>
          <p className="mt-1 text-xs text-gray-500">{item.status}</p>
        </div>
      ))}
      {selectedItems.length === 0 && <p className="text-sm text-gray-500">No records available.</p>}
    </div>
  );
}

