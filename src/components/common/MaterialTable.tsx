import { useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { Item } from "@/types/items.type";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface MaterialTableProps {
  items: Item[];
  onEdit: (item: Item) => void;
  onDelete: (itemId: number) => void;
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
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-center gap-2 mt-4 p-2"
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
        {pageNumbers.map((number) => (
          <motion.button
            key={number}
            onClick={() => onPageChange(number)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              currentPage === number
                ? "bg-slate-700/50 text-slate-200"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/25"
            }`}
          >
            {number}
          </motion.button>
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

const MobileCard: React.FC<{
  item: Item;
  onEdit: (item: Item) => void;
  onDelete: (itemId: number) => void;
}> = ({ item, onEdit, onDelete }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      layout
      className="bg-slate-700/30 rounded-lg p-4 space-y-3"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-slate-200 font-medium">{item.name}</h3>
          <span className="text-sm text-slate-400">{item.group.name}</span>
        </div>
        <div className="flex items-center gap-2">
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
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-slate-400 block mb-1">النوع</span>
          <span className="text-slate-200">
            {item.type === "production" ? "منتج" : "مادة خام"}
          </span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1">السعر</span>
          <span className="text-emerald-400">{item.price} ل.س</span>
        </div>
        <div>
          <span className="text-slate-400 block mb-1">الوحدة</span>
          <span className="text-slate-200">{item.unit}</span>
        </div>
      </div>

      {item.description && (
        <div className="pt-2 border-t border-slate-600/50">
          <span className="text-sm text-slate-400 block mb-1">الوصف</span>
          <p className="text-sm text-slate-300">{item.description}</p>
        </div>
      )}
    </motion.div>
  );
};

export const MaterialTable: React.FC<MaterialTableProps> = ({
  items,
  onEdit,
  onDelete,
}) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Reset to first page when items change
  useEffect(() => {
    setCurrentPage(1);
  }, [items.length]);

  // Calculate pagination
  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedItems = items.slice(startIndex, endIndex);

  if (isMobile) {
    return (
      <div className="space-y-4 p-4">
        <motion.div className="space-y-4">
          {paginatedItems.map((item) => (
            <MobileCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {items.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-6 text-slate-400"
            >
              لا توجد عناصر متطابقة مع معايير البحث
            </motion.div>
          )}
        </motion.div>
        {items.length > PAGE_SIZE && (
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
            <tr className="border-b border-slate-700/50">
              <th className="text-right text-slate-300 p-4">الاسم</th>
              <th className="text-right text-slate-300 p-4">النوع</th>
              <th className="text-right text-slate-300 p-4">التصنيف</th>
              <th className="text-right text-slate-300 p-4">السعر</th>
              <th className="text-right text-slate-300 p-4">الوحدة</th>
              <th className="text-right text-slate-300 p-4">الوصف</th>
              <th className="text-right text-slate-300 p-4">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((item) => (
              <motion.tr
                key={item.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                layout
                className="border-b border-slate-700/50 hover:bg-slate-700/25 transition-colors"
              >
                <td className="p-4 text-slate-200">{item.name}</td>
                <td className="p-4 text-slate-200">
                  {item.type === "production" ? "منتج" : "مادة خام"}
                </td>
                <td className="p-4 text-slate-200">{item.group.name}</td>
                <td className="p-4 text-emerald-400">{item.price} ل.س</td>
                <td className="p-4 text-slate-200">{item.unit}</td>
                <td className="p-4 text-slate-400 max-w-xs truncate">
                  {item.description}
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <button
                      className="p-1 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                      onClick={() => onEdit(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                      onClick={() => onDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center p-6 text-slate-400">
                  لا توجد عناصر متطابقة مع معايير البحث
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {items.length > PAGE_SIZE && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};

export default MaterialTable;
