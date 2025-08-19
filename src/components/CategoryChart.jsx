import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { formatCurrency } from "../utils/currencies";

const categoryColors = {
  "Food & Dining": "#ef4444",
  Transportation: "#3b82f6",
  Shopping: "#8b5cf6",
  Entertainment: "#ec4899",
  "Bills & Utilities": "#eab308",
  Healthcare: "#10b981",
  Travel: "#6366f1",
  Education: "#f97316",
  Business: "#14b8a6",
  Other: "#6b7280",
};

export default function CategoryChart({ data }) {
  const { user } = useUser();
  const userData = useQuery(
    api.users.get,
    user?.id ? { userId: user.id } : "skip"
  );
  const userCurrency = userData?.currency || "USD";

  const total = data.reduce((sum, item) => sum + item.total, 0);

  const calculatePercentage = (amount) => {
    return total > 0 ? ((amount / total) * 100).toFixed(1) : 0;
  };

  if (data.length === 0) {
    return (
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-800">
        <div className="text-center">
          <div className="h-32 flex items-center justify-center">
            <p className="text-neutral-400">No data available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950 rounded-xl p-6 border border-neutral-800">
      <div className="space-y-4">
        {data.map((item) => {
          const percentage = calculatePercentage(item.total);

          return (
            <div key={item.category} className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <div
                    className="size-3 rounded-full"
                    style={{
                      backgroundColor:
                        categoryColors[item.category] || "#6b7280",
                    }}
                  />

                  <span className="text-white font-medium">
                    {item.category}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-white font-medium">
                    {formatCurrency(item.total, userCurrency)}
                  </div>
                  <div className="text-neutral-300 text-xs">{percentage}%</div>
                </div>
              </div>

              <div className="w-full bg-neutral-700 roounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: categoryColors[item.category] || "#6b7280",
                  }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-neutral-800">
        <div className="flex justify-between items-center">
          <span className="text-neutral-300 font-medium">Total</span>
          <span className="text-white font-bold text-lg">
            {formatCurrency(total, userCurrency)}
          </span>
        </div>
      </div>
    </div>
  );
}
