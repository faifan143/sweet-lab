import { useState, useEffect, useMemo } from "react";
import { useMediaQuery } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { Item, ItemType } from "@/types/items.type";
import { Pencil, Trash2, ChevronLeft, ChevronRight, Eye, ArrowUpDown } from "lucide-react";
import { Role, useRoles } from "@/hooks/users/useRoles";

interface MaterialTableProps {
  items: Item[];
  getDefaultUnitPrice?: (item: Item) => number;
  onEdit: (item: Item) => void;
  onDelete: (itemId: number) => void;
  activeTab: ItemType | "all"

}

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
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Show first, last, current, and adjacent pages
      const result = [1];
      const leftBound = Math.max(2, currentPage - 1);
      const rightBound = Math.min(totalPages - 1, currentPage + 1);

      if (leftBound > 2) result.push(-1); // Add ellipsis
      for (let i = leftBound; i <= rightBound; i++) {
        result.push(i);
      }
      if (rightBound < totalPages - 1) result.push(-2); // Add ellipsis
      result.push(totalPages);

      return result;
    }
  }, [currentPage, totalPages]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center gap-2 my-4 p-2"
      dir="rtl"
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-1">
        {pageNumbers.map((number, index) => (
          number < 0 ? (
            <span key={`ellipsis-${index}`} className="px-2 text-slate-400">...</span>
          ) : (
            <motion.button
              key={number}
              onClick={() => onPageChange(number)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${currentPage === number
                ? "bg-emerald-500/20 text-emerald-400"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/25"
                }`}
            >
              {number}
            </motion.button>
          )
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-700/50 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
    </motion.div>
  );
};

// Helper function to get default unit price if not provided
const getItemPrice = (
  item: Item,
  getDefaultUnitPrice?: (item: Item) => number
): number => {
  if (getDefaultUnitPrice) {
    return getDefaultUnitPrice(item);
  }

  // Default implementation if no function is provided
  if (item.units && item.units.length > 0) {
    const defaultUnit = item.units.find((u) => u.unit === item.defaultUnit);
    return defaultUnit ? defaultUnit.price : item.units[0].price;
  }
  return 0;
};

// Helper function to get default unit
const getDefaultUnit = (item: Item): string => {
  return (
    item.defaultUnit ||
    (item.units && item.units.length > 0 ? item.units[0].unit : "")
  );
};

// Mobile Card Component with detail expansion
const MobileCard: React.FC<{
  item: Item;
  getDefaultUnitPrice?: (item: Item) => number;
  onEdit: (item: Item) => void;
  onDelete: (itemId: number) => void;
}> = ({ item, getDefaultUnitPrice, onEdit, onDelete }) => {
  const price = getItemPrice(item, getDefaultUnitPrice);
  const defaultUnit = getDefaultUnit(item);
  const [expanded, setExpanded] = useState(false);
  const { hasAnyRole } = useRoles();

  // Create color scheme based on item type
  const typeColor = item.type === "production"
    ? "text-blue-400 bg-blue-400/10"
    : "text-amber-400 bg-amber-400/10";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      layout
      className="bg-slate-700/30 rounded-lg overflow-hidden border border-slate-600/30"
    >
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-slate-200 font-medium">{item.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full ${typeColor}`}>
                {item.type === "production" ? "منتج" : "مادة خام"}
              </span>
            </div>
            <span className="text-sm text-slate-400">
              {item.group?.name || "-"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              className="p-1.5 text-slate-300 hover:bg-slate-600/30 rounded transition-colors"
              onClick={() => setExpanded(!expanded)}
            >
              <Eye className="h-4 w-4" />
            </button>
            {hasAnyRole([Role.ADMIN]) && (
              <>
                <button
                  className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                  onClick={() => onEdit(item)}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                  onClick={() => onDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-slate-400 block mb-1">السعر</span>
            <span className="text-emerald-400 font-medium">{price} ل.س</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-1">الوحدة الافتراضية</span>
            <span className="text-slate-200">{defaultUnit}</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-600/30 overflow-hidden"
          >
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-slate-400 block mb-1">الوحدات المتاحة</span>
                  <span className="text-slate-200">
                    {item.units?.map((u) => u.unit).join(", ") || "-"}
                  </span>
                </div>
                {item.cost !== undefined && (
                  <div>
                    <span className="text-slate-400 block mb-1">التكلفة</span>
                    <span className="text-slate-200">{item.cost} ل.س</span>
                  </div>
                )}
              </div>

              {item.description && (
                <div className="pt-2 border-t border-slate-600/30">
                  <span className="text-sm text-slate-400 block mb-1">الوصف</span>
                  <p className="text-sm text-slate-300">{item.description}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const MaterialTable: React.FC<MaterialTableProps> = ({
  items,
  getDefaultUnitPrice,
  onEdit,
  onDelete,
  activeTab
}) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Item | "price" | "defaultUnit";
    direction: "asc" | "desc";
  } | null>(null);

  const PAGE_SIZE = 10;
  const { hasAnyRole } = useRoles();

  // Reset to first page when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  // Apply sorting
  const sortedItems = useMemo(() => {
    let itemsToSort = [...items];

    if (sortConfig) {
      itemsToSort.sort((a, b) => {
        if (sortConfig.key === "price") {
          const aPrice = getItemPrice(a, getDefaultUnitPrice);
          const bPrice = getItemPrice(b, getDefaultUnitPrice);
          return sortConfig.direction === "asc"
            ? aPrice - bPrice
            : bPrice - aPrice;
        } else if (sortConfig.key === "defaultUnit") {
          const aUnit = getDefaultUnit(a).toLowerCase();
          const bUnit = getDefaultUnit(b).toLowerCase();
          return sortConfig.direction === "asc"
            ? aUnit.localeCompare(bUnit)
            : bUnit.localeCompare(aUnit);
        } else {
          // Handle case where the key might be null/undefined
          const aValue = a[sortConfig.key] || "";
          const bValue = b[sortConfig.key] || "";

          if (typeof aValue === "string" && typeof bValue === "string") {
            return sortConfig.direction === "asc"
              ? aValue.localeCompare(bValue)
              : bValue.localeCompare(aValue);
          } else if (typeof aValue === "number" && typeof bValue === "number") {
            return sortConfig.direction === "asc"
              ? aValue - bValue
              : bValue - aValue;
          }
          return 0;
        }
      });
    }

    return itemsToSort;
  }, [items, sortConfig, getDefaultUnitPrice]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(sortedItems.length / PAGE_SIZE));
  // Adjust currentPage if it's now beyond the total
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedItems = sortedItems.slice(startIndex, endIndex);

  // Sort handler
  const requestSort = (key: keyof Item | "price" | "defaultUnit") => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    setSortConfig({ key, direction });
  };

  const getSortIcon = (key: keyof Item | "price" | "defaultUnit") => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    }

    return sortConfig.direction === "asc"
      ? <ChevronRight className="h-4 w-4" />
      : <ChevronLeft className="h-4 w-4" />;
  };

  if (isMobile) {
    return (
      <div className="space-y-4 p-4">
        <motion.div className="space-y-3">
          {paginatedItems.map((item) => (
            <MobileCard
              key={item.id}
              item={item}
              getDefaultUnitPrice={getDefaultUnitPrice}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {sortedItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8 text-slate-400 bg-slate-800/20 rounded-lg"
            >
              لا توجد عناصر متطابقة مع معايير البحث
            </motion.div>
          )}
        </motion.div>
        {sortedItems.length > PAGE_SIZE && (
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
      <div className="overflow-x-auto">
        <table className="w-full" dir="rtl">
          <thead>
            <tr className="border-b border-slate-700/50 bg-slate-800/30">
              <th
                className="text-right text-slate-300 p-4 cursor-pointer hover:bg-slate-700/30"
                onClick={() => requestSort("name")}
              >
                <div className="flex items-center justify-between">
                  <span>الاسم</span>
                  {getSortIcon("name")}
                </div>
              </th>
              <th
                className="text-right text-slate-300 p-4 cursor-pointer hover:bg-slate-700/30"
                onClick={() => requestSort("type")}
              >
                <div className="flex items-center justify-between">
                  <span>النوع</span>
                  {getSortIcon("type")}
                </div>
              </th>
              <th className="text-right text-slate-300 p-4">التصنيف</th>
              <th
                className="text-right text-slate-300 p-4 cursor-pointer hover:bg-slate-700/30"
                onClick={() => requestSort("defaultUnit")}
              >
                <div className="flex items-center justify-between">
                  <span>الوحدة الافتراضية</span>
                  {getSortIcon("defaultUnit")}
                </div>
              </th>
              <th
                className="text-right text-slate-300 p-4 cursor-pointer hover:bg-slate-700/30"
                onClick={() => requestSort("price")}
              >
                <div className="flex items-center justify-between">
                  <span>السعر</span>
                  {getSortIcon("price")}
                </div>
              </th>
              {activeTab == "raw" && <th className="text-right text-slate-300 p-4">التكلفة</th>}
              <th className="text-right text-slate-300 p-4">الوحدات المتاحة</th>
              <th className="text-right text-slate-300 p-4">الوصف</th>
              <th className="text-right text-slate-300 p-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item) => {
              const price = getItemPrice(item, getDefaultUnitPrice);
              const defaultUnit = getDefaultUnit(item);
              const availableUnits =
                item.units?.map((u) => u.unit).join(", ") || "-";

              return (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  layout
                  className="border-b border-slate-700/50 hover:bg-slate-700/25 transition-colors"
                >
                  <td className="p-4 text-slate-200 font-medium">{item.name}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-md text-sm ${item.type === "production"
                      ? "bg-blue-400/10 text-blue-400"
                      : "bg-amber-400/10 text-amber-400"
                      }`}>
                      {item.type === "production" ? "منتج" : "مادة خام"}
                    </span>
                  </td>
                  <td className="p-4 text-slate-200">
                    {item.group?.name || "-"}
                  </td>
                  <td className="p-4 text-slate-200">{defaultUnit}</td>
                  <td className="p-4 text-emerald-400 font-medium">{price} ل.س</td>
                  {activeTab == "raw" && <td className="p-4 text-emerald-400 font-medium">{item.cost} ل.س</td>
                  }                  <td className="p-4 text-slate-200">{availableUnits}</td>
                  <td className="p-4 text-slate-400 max-w-xs truncate">
                    {item.description}
                  </td>
                  <td className="p-4">
                    {hasAnyRole([Role.ADMIN]) ? (
                      <div className="flex items-center gap-3">
                        <button
                          className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                          onClick={() => onEdit(item)}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                          onClick={() => onDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-slate-500 text-sm">لا يوجد اجراءات متاحة</div>
                    )}
                  </td>
                </motion.tr>
              );
            })}
            {sortedItems.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center p-8 text-slate-400">
                  لا توجد عناصر متطابقة مع معايير البحث
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div >
      {
        sortedItems.length > PAGE_SIZE && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )
      }
    </>
  );
};

export default MaterialTable;