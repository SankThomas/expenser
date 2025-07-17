import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useState, useMemo } from "react";
import { Plus } from "lucide-react";
import StatsCard from "./StatsCard";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import CategoryChart from "./CategoryChart";
import MonthFilter from "./MonthFilter";

export default function Dashboard() {
  const { user } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const storeUser = useMutation(api.users.storeUser);
  const expenses = useQuery(
    api.expenses.list,
    user?.id ? { userId: user.id } : "skip"
  );
  const categoryTotals = useQuery(
    api.expenses.getTotalByCategory,
    user?.id ? { userId: user.id } : "skip"
  );

  useEffect(() => {
    if (user) {
      storeUser({
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress || "",
        name: user.fullName || user.firstName || "User",
      });
    }
  }, [user, storeUser]);

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingExpense(null);
  };

  const filteredExpenses = useMemo(() => {
    if (!expenses) return [];

    return expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);

      return (
        expenseDate.getMonth() === selectedMonth.getMonth() &&
        expenseDate.getFullYear() === selectedMonth.getFullYear()
      );
    });
  }, [expenses, selectedMonth]);

  const totalExpenses =
    expenses?.reduce((sum, expense) => sum + expense.amount, 0) || 0;
  const monthlyExpenses = filteredExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <div className="min-h-screen bg-transparent">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-neutral-300">Track and manage your expenses</p>
        </div>

        <div className="mb-6">
          <MonthFilter
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>

        <StatsCard
          totalExpenses={totalExpenses}
          monthlyExpenses={monthlyExpenses}
          expenseCount={filteredExpenses.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Expenses</h2>

              <button
                onClick={() => setShowForm(true)}
                className="bg-white hover:bg-white/75 text-neutral-900 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="size-4" /> Add Expense
              </button>
            </div>

            <ExpenseList
              expenses={filteredExpenses}
              onEdit={handleEditExpense}
            />
          </div>

          <div>
            <h2 className="text-xl font-bold text-white mb-6">
              Spending by category
            </h2>

            <CategoryChart data={categoryTotals || []} />
          </div>
        </div>
      </main>

      {showForm && (
        <ExpenseForm expense={editingExpense} onClose={handleFormClose} />
      )}
    </div>
  );
}
