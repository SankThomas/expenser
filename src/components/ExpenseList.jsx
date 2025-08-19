import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { format } from "date-fns";
import { formatCurrency } from "../utils/currencies";
import { Edit } from "lucide-react";
import { Trash2 } from "lucide-react";
import DeleteModal from "./DeleteModal";
import { DollarSign } from "lucide-react";

const categoryColors = {
  "Food & Dining": "bg-red-500",
  Transportation: "bg-white",
  Shopping: "bg-purple-500",
  Entertainment: "bg-pink-500",
  "Bills & Utilities": "bg-yellow-500",
  Heathcare: "bg-green-500",
  Travel: "bg-indigo-500",
  Education: "bg-orange-500",
  Business: "bg-teal-500",
  Other: "bg-gray-500",
};

export default function ExpenseList({ expenses, onEdit }) {
  const { user } = useUser();
  const userData = useQuery(
    api.users.get,
    user?.id ? { userId: user.id } : "skip"
  );
  const userCurrency = userData?.currency || "USD";
  const deleteExpense = useMutation(api.expenses.remove);

  const [deleteModal, setDeleteModal] = useState({
    show: false,
    expense: null,
  });

  const handleDelete = async () => {
    if (!deleteModal.expense) return;

    try {
      await deleteExpense({ id: deleteModal.expense._id });
      setDeleteModal({ show: false, expense: null });
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const openDeleteModal = (expense) => {
    setDeleteModal({ show: true, expense });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, expense: null });
  };

  if (expenses.length === 0) {
    return (
      <div className="bg-neutral-900 rounded-xl p-8 border border-neutral-700 text-center">
        <DollarSign className="size-12 text-neutral-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No expenses yet</h3>
        <p className="text-neutral-300">
          Start tracking your expenses by adding your first entry.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 rounded-xl border-neutral-800 overflow-hidden">
      <div className="divide-y divide-neutral-800">
        {expenses.map((expense) => (
          <div
            key={expense._id}
            className="p-6 hover:bg-neutral-900 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`size-3 rounded-full ${
                    categoryColors[expense.category] || "bg-gray-500"
                  }`}
                />

                <div>
                  <h3 className="text-white font-medium">
                    {expense.description}
                  </h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-neutral-300">{expense.category}</span>
                    <span className="text-neutral-400 text-sm">&middot;</span>
                    <span className="text-neutral-300">
                      {format(new Date(expense.date), "MMM d, yyyy")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-xl font-bold text-white">
                  {formatCurrency(expense.amount, userCurrency)}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onEdit(expense)}
                    className="text-neutral-400 hover:text-white/75 transition-colors"
                  >
                    <Edit className="size-4.5" />
                  </button>

                  <button
                    onClick={() => openDeleteModal(expense)}
                    className="text-neutral-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="size-4.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <DeleteModal
        isOpen={deleteModal.show}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Delete Expense"
        message={`Are you sure you want to delete this expense ${deleteModal.expense?.description}? This action cannot be undone`}
      />
    </div>
  );
}
