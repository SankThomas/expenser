import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  Download,
  FileText,
  Calendar,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import MonthFilter from "./MonthFilter";
import { formatCurrency } from "../utils/currencies";

export default function Reports() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.get,
    user?.id ? { userId: user.id } : "skip"
  );
  const userCurrency = userData?.currency || "USD";
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const expenses = useQuery(
    api.expenses.list,
    user?.id ? { userId: user.id } : "skip"
  );

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

  const monthlyStats = useMemo(() => {
    const total = filteredExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );

    const count = filteredExpenses.length;
    const average = count > 0 ? total / count : 0;

    const categoryBreakdown = {};
    filteredExpenses.forEach((expense) => {
      categoryBreakdown[expense.category] =
        categoryBreakdown[expense.category] || 0 + expense.amount;
    });

    const topCategory = Object.entries(categoryBreakdown).sort(
      ([, a], [, b]) => b - a
    )[0];

    return {
      total,
      count,
      average,
      topCategory: topCategory
        ? { name: topCategory[0], amount: topCategory[1] }
        : null,
      categoryBreakdown,
    };
  }, [filteredExpenses]);

  const exportToCSV = () => {
    if (filteredExpenses.length === 0) {
      alert("No expenses to export for the selected month");
      return;
    }

    const headers = ["Date", "Description", "Category", "Amount"];
    const csvContent = [
      headers.join(","),
      ...filteredExpenses.map((expense) =>
        [
          format(new Date(expense.date), "yyyy-MM-dd"),
          `"${expense.description}"`,
          `"${expense.category}"`,
          expense.amount,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `expenses-${format(selectedMonth, "yyyy-MM")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Reports</h1>
        <p className="text-neutral-300">
          Analyze your spending patterns and export your data
        </p>
      </div>

      <div className="mb-6">
        <MonthFilter
          selectedMonth={selectedMonth}
          onMonthChange={setSelectedMonth}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-transparent rounded-xl border border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-300 font-medium">Total Spent</p>
              <p className="text-2xl font-bold text-white mt-1">
                {formatCurrency(monthlyStats.total, userCurrency)}
              </p>
            </div>

            <DollarSign className="size-8 text-white" />
          </div>
        </div>

        <div className="bg-transparent rounded-xl border border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-300 font-medium">Transactions</p>
              <p className="text-2xl font-bold text-white mt-1">
                {monthlyStats.count}
              </p>
            </div>

            <FileText className="size-8 text-white" />
          </div>
        </div>

        <div className="bg-transparent rounded-xl border border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-300 font-medium">Average</p>
              <p className="text-2xl font-bold text-white mt-1">
                {formatCurrency(monthlyStats.average, userCurrency)}
              </p>
            </div>

            <TrendingUp className="size-8 text-white" />
          </div>
        </div>

        <div className="bg-transparent rounded-xl border border-neutral-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-300 font-medium">Top Spend</p>
              <p className="text-lg font-bold text-white mt-1">
                {monthlyStats.topCategory?.name || "N/A"}
              </p>
              {monthlyStats.topCategory && (
                <p className="text-neutral-300">
                  {formatCurrency(
                    monthlyStats.topCategory.amount,
                    userCurrency
                  )}
                </p>
              )}
            </div>

            <Calendar className="size-8 text-white" />
          </div>
        </div>
      </div>

      <div className="bg-transparent rounded-xl border border-neutral-800 mb-8 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Export Data
            </h3>
            <p className="text-neutral-300">
              Download your expense data for{" "}
              {format(selectedMonth, "MMMM yyyy")} as a CSV file.
            </p>
          </div>

          <button
            onClick={exportToCSV}
            disabled={filteredExpenses.length === 0}
            className="bg-white hover:bg-white/75 disabled:bg-neutral-600 disabled:text-neutral-400 text-neutral-900 font-bold px-6 py-3 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Download className="size-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-transparent rounded-xl p-6 border border-neutral-800">
        <h3 className="text-lg font-semibold text-white mb-6">
          Category Breakdown
        </h3>

        {Object.keys(monthlyStats.categoryBreakdown).length === 0 ? (
          <div className="text-center py-8">
            <FileText className="size-12 text-neutral-400 mx-auto mb-4" />
            <p className="text-neutral-300">
              No expenses found for {format(selectedMonth, "MMMM yyyy")}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(monthlyStats.categoryBreakdown)
              .sort(([, a], [, b]) => b - a)
              .map(([category, amount]) => {
                const percentage = (
                  (amount / monthlyStats.total) *
                  100
                ).toFixed(1);

                return (
                  <div
                    key={category}
                    className="flex items-center justify-between p-4 bg-neutral-900 border border-neutral-800 rounded-lg"
                  >
                    <div>
                      <h4 className="text-white font-medium">{category}</h4>
                      <p className="text-neutral-300">
                        {percentage}% of total spending
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-white font-semibold">
                        {formatCurrency(amount, userCurrency)}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}
