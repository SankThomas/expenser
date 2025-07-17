import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function MonthFilter({ selectedMonth, onMonthChange }) {
  const goToPreviousMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    onMonthChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    onMonthChange(newDate);
  };

  const goToCurrentMonth = () => {
    onMonthChange(new Date());
  };

  const isCurrentMonth = () => {
    const now = new Date();
    return (
      selectedMonth.getMonth() === now.getMonth() &&
      selectedMonth.getFullYear() === now.getFullYear()
    );
  };

  return (
    <div className="bg-neutral-900 rounded-xl border border-neutral-800 flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <Calendar className="size-5 text-white" />
        <span className="text-neutral-300 text-sm font-medium">
          Viewing expenses for:
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
        >
          <ChevronLeft className="size-4" />
        </button>

        <div className="text-center min-w-[140px]">
          <h3 className="text-white font-semibold">
            {format(selectedMonth, "MMMM yyyy")}
          </h3>
        </div>

        <button
          onClick={goToNextMonth}
          className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-700 rounded-lg transition-colors"
        >
          <ChevronRight className="size-4" />
        </button>

        {!isCurrentMonth() && (
          <button
            onClick={goToCurrentMonth}
            className="px-3 py-1 text-xs bg-white hover:bg-white/75 text-neutral-900 rounded-md transition-colors"
          >
            Jump to current month
          </button>
        )}
      </div>
    </div>
  );
}
