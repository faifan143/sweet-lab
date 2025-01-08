import { Filter, Search } from "lucide-react";

interface InvoiceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
}

export const InvoiceFilters = ({
  searchTerm,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
}: InvoiceFiltersProps) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => onDateFilterChange(e.target.value)}
          className="px-3 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
        />
        <Filter className="h-4 w-4 text-slate-400" />
      </div>
      <div className="relative flex-1 sm:flex-none">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          dir="rtl"
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="بحث..."
          className="w-full sm:w-64 pl-4 pr-10 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
        />
      </div>
    </div>
  );
};
