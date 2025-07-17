import { DollarSign, TrendingUp, Receipt } from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatCurrency } from "../utils/currencies";

export default function StatsCard({
  totalExpenses,
  monthlyExpenses,
  expenseCount,
}) {
  const { user } = useUser();
  const userData = useQuery(
    api.users.get,
    user?.id ? { userId: user.id } : "skip"
  );
  const userCurrency = userData?.currency || "USD";

  const stats = [
    {
      name: "Total Expenses",
      value: formatCurrency(totalExpenses, userCurrency),
      icon: DollarSign,
      color: "text-primary-500",
    },
    {
      name: "This Month",
      value: formatCurrency(monthlyExpenses, userCurrency),
      icon: TrendingUp,
      color: "text-white",
    },
    {
      name: "Total Records",
      value: expenseCount.toString(),
      icon: Receipt,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-transparent rounded-xl p-6 border border-neutral-800 hover:border-neutral-600 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-300 text-sm font-medium">
                {stat.name}
              </p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>

            <stat.icon className={`size-8 ${stat.color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
