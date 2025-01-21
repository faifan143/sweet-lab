import { useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { TrayTracking } from "@/types/items.type";
import { formatDate } from "@/utils/formatters";

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
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              currentPage === number
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

export const TrayTable: React.FC<TrayTableProps> = ({
  trays = [],
  isLoading,
  isPending,
  onReturn,
}) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Reset to first page when trays change
  useEffect(() => {
    setCurrentPage(1);
  }, [trays.length]);

  // Calculate pagination
  const totalPages = Math.ceil(trays.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedTrays = trays.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="w-full h-64 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {paginatedTrays.map((tray) => (
          <MobileTrayCard
            key={tray.id}
            tray={tray}
            isPending={isPending}
            onReturn={onReturn}
          />
        ))}
        {!trays.length && (
          <div className="text-center p-8 text-slate-400 bg-slate-800/50 rounded-lg">
            لا توجد فوارغ معلقة
          </div>
        )}
        {trays.length > PAGE_SIZE && (
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
      <div className="bg-slate-800/50 rounded-lg border border-slate-700/50">
        <table className="w-full" dir="rtl">
          <thead className="bg-slate-700/30">
            <tr>
              <th className="text-right p-3 text-slate-300">العميل</th>
              <th className="text-right p-3 text-slate-300">رقم الهاتف</th>
              <th className="text-right p-3 text-slate-300">عدد الفوارغ</th>
              <th className="text-right p-3 text-slate-300">تاريخ الاستلام</th>
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
                </td>
              </tr>
            ))}
            {!trays.length && (
              <tr>
                <td colSpan={6} className="text-center p-4 text-slate-400">
                  لا توجد فوارغ معلقة
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {trays.length > PAGE_SIZE && (
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
