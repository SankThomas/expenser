import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { X, DollarSign, Calendar, Tag, FileText } from "lucide-react";

export default function ExpenseForm({ expense, onClose }) {
  const { user } = useUser();
  const categories = useQuery(
    api.categories.list,
    user?.id ? { userId: user.id } : "skip"
  );

  const [formData, setFormData] = useState({
    amount: expense?.amount || "",
    description: expense?.description || "",
    category: expense?.category || "",
    date: expense?.date
      ? new Date(expense.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createExpense = useMutation(api.expenses.create);
  const updateExpense = useMutation(api.expenses.update);

  useState(() => {
    if (categories && categories.length > 0 && !formData.category && !expense) {
      setFormData((prev) => ({ ...prev, category: categories[0].name }));
    }
  }, [categories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    try {
      const expenseData = {
        amount: parseFloat(formData.amount),
        description: formData.description,
        category: formData.category,
        date: new Date(formData.date).getTime(),
      };

      if (expense) {
        await updateExpense({
          id: expense._id,
          ...expenseData,
        });
      } else {
        await createExpense({
          userId: user.id,
          ...expenseData,
        });
      }

      onClose();
    } catch (error) {
      console.error("Error saving expense", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-950 rounded-xl p-6 w-full max-w-md border border-neutral-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-x font-bold text-white">
            {expense ? "Edit Expense" : "Add New Expense"}
          </h2>

          <button
            onClick={onClose}
            className="text-neutral-300 hover:text-white transition-colors"
          >
            <X className="'size-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-neutral-200 font-medium mb-2">
              <DollarSign className="inline size-4 mr-1" />
              Amount
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-200 font-medium mb-2">
              <FileText className="inline size-4 mr-1" />
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              placeholder="What did you spend on?"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-200 font-medium mb-2">
              <Tag className="inline size-4 mr-1" />
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
            >
              {categories?.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-neutral-200 font-medium mb-2">
              <Calendar className="inline size-4 mr-1" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
              required
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-white hover:bg-white/75 text-neutral-900 font-bold py-2 rounded-lg transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : expense ? "Update" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
