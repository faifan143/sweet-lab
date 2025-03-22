import { Search, X } from "lucide-react";

// Search Component
export const SearchBar = ({
  searchTerm,
  onSearchChange,
  onClearSearch,
}: {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}) => (
  <div className="mb-8 " dir="rtl">
    <div className="relative">
      <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="البحث في المشتريات..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full px-4 pr-10 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-purple-500/30"
      />
      {searchTerm && (
        <button
          onClick={onClearSearch}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  </div>
);
