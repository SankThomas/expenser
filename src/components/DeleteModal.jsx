import { X, AlertTriangle } from "lucide-react";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-800 rounded-xl p-6 w-full max-w-md border border-neutral-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <AlertTriangle className="size-6 text-red-500 mr-3" />
            <h2 className="text-xl font-bold text-white">{title}</h2>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-300 hover:text-white transition-colors"
          >
            <X className="size-6" />
          </button>
        </div>

        <p className="text-neutral-300 mb-8">{message}</p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 bg-neutral-600 hover:bg-neutral-500 text-white py-2 rounded-lg transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
