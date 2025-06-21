import { useMediaQuery } from "@mui/material";
import {
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  User,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { EmployeeDebt } from "@/types/debts.type";
import { useEffect, useState } from "react";

interface EmployeeDebtsTableProps {
  debts: EmployeeDebt[];
  onViewDetails: (debt: EmployeeDebt) => void;
}

interface MobileEmployeeDebtCardProps {
  debt: EmployeeDebt;
  onViewDetails: (debt: EmployeeDebt) => void;
}

// Status Badge Component
const EmployeeDebtStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case "active":
        return "bg-warning/10 text-warning";
      case "paid":
        return "bg-success/10 text-success";
      default:
        return "bg-slate-700/50 text-slate-300";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "active":
        return <Clock className="h-3 w-3" />;
      case "paid":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs ${getStatusStyles()}`}
    >
      {getStatusIcon()}
      <span>
        {status === "active" ? "نشط" : status === "paid" ? "مدفوع" : status}
      </span>
    </span>
  );
};

// Mobile Card Component
const MobileEmployeeDebtCard: React.FC<MobileEmployeeDebtCardProps> = ({
  debt,
  onViewDetails,
}) => {
  return (
    <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-4 space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-400" />
            <span className="text-slate-200 font-medium">
              {debt.employee.username}
            </span>
          </div>
        </div>
        <EmployeeDebtStatusBadge status={debt.status} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-400">المبلغ الكلي</p>
          <p className="text-emerald-400 font-semibold">
            {formatCurrency(debt.totalAmount)}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-400">المبلغ المتبقي</p>
          <p className="text-red-400 font-semibold">
            {formatCurrency(debt.remainingAmount)}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm text-slate-400">
          تاريخ الإنشاء: {formatDate(debt.createdAt)}
        </div>
        <div className="text-sm text-slate-400">
          عدد الفواتير المرتبطة: {debt.relatedInvoices.length}
        </div>
      </div>

      <button
        onClick={() => onViewDetails(debt)}
        className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-700/25 text-slate-300 hover:bg-slate-700/50 transition-colors"
      >
        <Eye className="h-4 w-4" />
        <span>عرض التفاصيل</span>
      </button>
    </div>
  );
};

// Pagination Controls Component
const PaginationControls: React.FC<{
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}> = ({ currentPage, totalPages, onPageChange }) => {
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

export const EmployeeDebtsTable: React.FC<EmployeeDebtsTableProps> = ({
  debts,
  onViewDetails,
}) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Reset to first page when debts change
  useEffect(() => {
    setCurrentPage(1);
  }, [debts.length]);

  // Calculate pagination
  const totalPages = Math.ceil(debts.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const paginatedDebts = debts.slice(startIndex, endIndex);

  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="space-y-4">
          {paginatedDebts.map((debt) => (
            <MobileEmployeeDebtCard
              key={debt.id}
              debt={debt}
              onViewDetails={onViewDetails}
            />
          ))}
          {debts.length === 0 && (
            <div className="text-center p-8 text-slate-400 bg-slate-800/50 rounded-lg">
              لا توجد ديون موظفين
            </div>
          )}
        </div>

        {debts.length > PAGE_SIZE && (
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
      <div className="bg-slate-800/50 rounded-lg border border-slate-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full" dir="rtl">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-right text-muted-foreground font-medium p-4">
                  الموظف
                </th>
                <th className="text-right text-muted-foreground font-medium p-4">
                  المبلغ الكلي
                </th>
                <th className="text-right text-muted-foreground font-medium p-4">
                  المبلغ المتبقي
                </th>
                <th className="text-right text-muted-foreground font-medium p-4">
                  عدد الفواتير
                </th>
                <th className="text-right text-muted-foreground font-medium p-4">
                  تاريخ الإنشاء
                </th>
                <th className="text-right text-muted-foreground font-medium p-4">
                  آخر تحديث
                </th>
                <th className="text-right text-muted-foreground font-medium p-4">
                  الحالة
                </th>
                <th className="text-right text-muted-foreground font-medium p-4">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {paginatedDebts.map((debt) => (
                <tr
                  key={debt.id}
                  className="hover:bg-slate-700/25 transition-colors"
                >
                  <td className="p-4 text-slate-200">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-slate-400" />
                      <span>{debt.employee.username}</span>
                    </div>
                  </td>
                  <td className="p-4 text-emerald-400">
                    {formatCurrency(debt.totalAmount)}
                  </td>
                  <td className="p-4 text-red-400">
                    {formatCurrency(debt.remainingAmount)}
                  </td>
                  <td className="p-4 text-slate-300">
                    {debt.relatedInvoices.length}
                  </td>
                  <td className="p-4 text-slate-300">
                    {formatDate(debt.createdAt)}
                  </td>
                  <td className="p-4 text-slate-300">
                    {formatDate(debt.updatedAt)}
                  </td>
                  <td className="p-4">
                    <EmployeeDebtStatusBadge status={debt.status} />
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => onViewDetails(debt)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm bg-slate-700/25 text-slate-300 hover:bg-slate-700/50 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>عرض التفاصيل</span>
                    </button>
                  </td>
                </tr>
              ))}
              {debts.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    لا توجد ديون موظفين
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {debts.length > PAGE_SIZE && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
};

export default EmployeeDebtsTable;
