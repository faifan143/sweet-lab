// src/components/common/InvoiceFilters.tsx
import { Search } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateFilter {
  startDate: Date | null;
  endDate: Date | null;
}

interface InvoiceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateFilter: DateFilter;
  onDateFilterChange: (value: DateFilter) => void;
}

export function InvoiceFilters({
  searchTerm,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
}: InvoiceFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4" dir="rtl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="بحث..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-4 pr-12 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50"
        />
      </div>

      {/* Date Range Picker */}
      <div className="flex gap-2">
        <DatePicker
          selected={dateFilter.startDate}
          onChange={(date) =>
            onDateFilterChange({ ...dateFilter, startDate: date })
          }
          selectsStart
          startDate={dateFilter.startDate}
          endDate={dateFilter.endDate}
          placeholderText="تاريخ البداية"
          className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 text-right"
        />

        <DatePicker
          selected={dateFilter.endDate}
          onChange={(date) =>
            onDateFilterChange({ ...dateFilter, endDate: date })
          }
          selectsEnd
          startDate={dateFilter.startDate}
          endDate={dateFilter.endDate}
          minDate={dateFilter.startDate!}
          placeholderText="تاريخ النهاية"
          className="px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 text-right"
        />
      </div>
    </div>
  );
}
