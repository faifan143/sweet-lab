import { useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import {
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  X
} from "lucide-react";
import { TrayTracking } from "@/types/items.type";
import { formatDate } from "@/utils/formatters";
import PageSpinner from "./PageSpinner";
import { Role, useRoles } from "@/hooks/users/useRoles";

interface TrayTableProps {
  trays?: TrayTracking[];
  isLoading: boolean;
  isPending: boolean;
  onReturn: (tray: TrayTracking) => void;
}

interface MobileTrayCardProps {
  tray: TrayTracking;
  isPending: boolean;
  onReturn: (tray: TrayTracking) => void;
}

// Define sort types
type SortField = 'customerName' | 'customerPhone' | 'totalTrays' | 'createdAt';
type SortDirection = 'asc' | 'desc';

// Pagination Controls Component
const PaginationControls = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-4 p-2" dir="rtl">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${currentPage === number
              ? "bg-slate-700/50 text-slate-200"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/25"
              }`}
          >
            {number}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
    </div>
  );
};

// Table header component with sort functionality
const SortableHeader: React.FC<{
  field: SortField;
  currentSortField: SortField | null;
  sortDirection: SortDirection;
  onClick: (field: SortField) => void;
  title: string;
  className?: string;
}> = ({ field, currentSortField, sortDirection, onClick, title, className }) => (
  <th
    className={`text-right p-3 text-slate-300 cursor-pointer hover:bg-slate-700/20 transition-colors ${className || ''}`}
    onClick={() => onClick(field)}
  >
    <div className="flex items-center gap-1">
      {title}
      {currentSortField === field ? (
        sortDirection === 'asc' ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )
      ) : (
        <div className="h-4 w-4"></div> // Empty placeholder to maintain alignment
      )}
    </div>
  </th>
);

// Mobile Card Component
const MobileTrayCard: React.FC<MobileTrayCardProps> = ({
  tray,
  isPending,
  onReturn,
}) => {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 space-y-4">
      <div>
        <p className="text-sm text-slate-400">العميل</p>
        <p className="text-slate-300">{tray.customer.name}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-400">رقم الهاتف</p>
          <p className="text-slate-300">{tray.customer.phone || "-"}</p>
        </div>
        <div>
          <p className="text-sm text-slate-400">عدد الفوارغ</p>
          <p className="text-slate-300">{tray.totalTrays}</p>
        </div>
      </div>

      <div>
        <p className="text-sm text-slate-400">تاريخ الاستلام</p>
        <p className="text-slate-300">{formatDate(tray.createdAt)}</p>
      </div>

      {tray.notes && (
        <div>
          <p className="text-sm text-slate-400">ملاحظات</p>
          <p className="text-slate-300">{tray.notes}</p>
        </div>
      )}

      <button
        onClick={() => onReturn(tray)}
        disabled={isPending}
        className="w-full bg-emerald-500/10 text-emerald-400 px-3 py-2 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
      >
        {isPending ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>جاري الارجاع...</span>
          </div>
        ) : (
          "إرجاع الفوارغ"
        )}
      </button>
    </div>
  );
};

// Search Component
const SearchBox: React.FC<{
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="relative mb-4">
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-3 pr-10 bg-slate-800/50 border border-slate-700/50 rounded-lg text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        placeholder="بحث بإسم العميل أو رقم الهاتف..."
        dir="rtl"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 hover:text-slate-200"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
};

export const TrayTable: React.FC<TrayTableProps> = ({
  trays = [],
  isLoading,
  isPending,
  onReturn,
}) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const PAGE_SIZE = 10;
  const { hasAnyRole } = useRoles();

  // Sorting state
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Reset to first page when trays change or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [trays.length, searchQuery]);

  // Handle sorting
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New field, set to ascending by default
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter trays based on search query
  const filteredTrays = trays.filter(tray => {
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    const customerName = tray.customer.name.toLowerCase();
    const customerPhone = (tray.customer.phone || '').toLowerCase();

    return customerName.includes(query) || customerPhone.includes(query);
  });

  // Apply sorting to filtered trays
  const sortedTrays = [...filteredTrays].sort((a, b) => {
    if (!sortField) return 0;

    let valueA, valueB;

    // Get comparative values based on sort field
    switch (sortField) {
      case 'customerName':
        valueA = a.customer.name.toLowerCase();
        valueB = b.customer.name.toLowerCase();
        break;
      case 'customerPhone':
        valueA = (a.customer.phone || '').toLowerCase();
        valueB = (b.customer.phone || '').toLowerCase();
        break;
      case 'totalTrays':
        valueA = a.totalTrays;
        valueB = b.totalTrays;
        break;
      case 'createdAt':
        valueA = new Date(a.createdAt).getTime();
        valueB = new Date(b.createdAt).getTime();
        break;
      default:
        return 0;
    }

    // String comparison for string values
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    // Numeric comparison for numbers
    return sortDirection === 'asc'
      ? (valueA as number) - (valueB as number)
      : (valueB as number) - (valueA as number);
  });

  // Calculate pagination
  const totalPages = Math.ceil(sortedTrays.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedTrays = sortedTrays.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex justify-center items-center">
        <PageSpinner />
      </div>
    );
  }

  // Mobile sorting options component
  const MobileSortOptions = () => (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-3 mb-4">
      <div className="text-sm text-slate-300 mb-2">ترتيب حسب:</div>
      <div className="flex flex-wrap gap-2">
        {[
          { field: 'customerName', label: 'العميل' },
          { field: 'totalTrays', label: 'عدد الفوارغ' },
          { field: 'createdAt', label: 'تاريخ الاستلام' }
        ].map((item) => (
          <button
            key={item.field}
            onClick={() => handleSort(item.field as SortField)}
            className={`px-3 py-1 rounded-lg text-xs flex items-center gap-1 transition-colors
              ${sortField === item.field
                ? "bg-blue-500/20 text-blue-400"
                : "bg-slate-700/30 text-slate-300"
              }`}
          >
            {item.label}
            {sortField === item.field && (
              sortDirection === 'asc'
                ? <ChevronUp className="h-3 w-3" />
                : <ChevronDown className="h-3 w-3" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className="space-y-4">
        <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {filteredTrays.length > 0 && <MobileSortOptions />}

        {paginatedTrays.map((tray) => (
          <MobileTrayCard
            key={tray.id}
            tray={tray}
            isPending={isPending}
            onReturn={onReturn}
          />
        ))}

        {filteredTrays.length === 0 && (
          <div className="text-center p-8 text-slate-400 bg-slate-800/50 rounded-lg">
            {searchQuery ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد فوارغ معلقة'}
          </div>
        )}

        {filteredTrays.length > PAGE_SIZE && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <SearchBox searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <div className="bg-slate-800/50 rounded-lg border border-slate-700/50">
        <table className="w-full" dir="rtl">
          <thead className="bg-slate-700/30">
            <tr>
              <SortableHeader
                field="customerName"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onClick={handleSort}
                title="العميل"
              />
              <SortableHeader
                field="customerPhone"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onClick={handleSort}
                title="رقم الهاتف"
              />
              <SortableHeader
                field="totalTrays"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onClick={handleSort}
                title="عدد الفوارغ"
              />
              <SortableHeader
                field="createdAt"
                currentSortField={sortField}
                sortDirection={sortDirection}
                onClick={handleSort}
                title="تاريخ الاستلام"
              />
              <th className="text-right p-3 text-slate-300">ملاحظات</th>
              <th className="text-right p-3 text-slate-300">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTrays.map((tray) => (
              <tr key={tray.id} className="border-t border-slate-700/50">
                <td className="p-3 text-slate-300">{tray.customer.name}</td>
                <td className="p-3 text-slate-300">
                  {tray.customer.phone || "-"}
                </td>
                <td className="p-3 text-slate-300">{tray.totalTrays}</td>
                <td className="p-3 text-slate-300">
                  {formatDate(tray.createdAt)}
                </td>
                <td className="p-3 text-slate-300">{tray.notes || "-"}</td>
                <td className="p-3">
                  {hasAnyRole([Role.ADMIN, Role.TrayManager]) ? (
                    <button
                      onClick={() => onReturn(tray)}
                      disabled={isPending}
                      className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                    >
                      {isPending ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>جاري الارجاع...</span>
                        </div>
                      ) : (
                        "إرجاع الفوارغ"
                      )}
                    </button>
                  ) : (
                    <div className="text-red-300">لا توجد اجراءات متاحة</div>
                  )}
                </td>
              </tr>
            ))}
            {filteredTrays.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-slate-400">
                  {searchQuery ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد فوارغ معلقة'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {filteredTrays.length > PAGE_SIZE && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};

export default TrayTable;