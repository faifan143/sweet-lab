import { formatSYP } from "@/hooks/invoices/useInvoiceStats";
import { Invoice } from "@/types/invoice.type";
import { DollarSign, ArrowDownCircle, Clock } from "lucide-react";

// InvoiceStats.tsx
interface InvoiceStatsProps {
  data: Invoice[];
}

export const InvoiceStats: React.FC<InvoiceStatsProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">إجمالي المبيعات</p>
            <p className="text-emerald-400 text-lg font-semibold">
              {formatSYP(
                data
                  .filter((inv) => inv.invoiceType === "income")
                  .reduce(
                    (sum, inv) => sum + (inv.totalAmount - inv.discount),
                    0
                  )
              )}
            </p>
          </div>
          <DollarSign className="h-8 w-8 text-emerald-400/20" />
        </div>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">إجمالي المصروفات</p>
            <p className="text-red-400 text-lg font-semibold">
              {formatSYP(
                data
                  .filter((inv) => inv.invoiceType === "expense")
                  .reduce(
                    (sum, inv) => sum + (inv.totalAmount - inv.discount),
                    0
                  )
              )}
            </p>
          </div>
          <ArrowDownCircle className="h-8 w-8 text-red-400/20" />
        </div>
      </div>

      <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">معدل التحصيل</p>
            <p className="text-blue-400 text-lg font-semibold">
              {(
                (data.filter((inv) => inv.paidStatus).length /
                  Math.max(data.length, 1)) *
                100
              ).toFixed(1)}
              %
            </p>
          </div>
          <Clock className="h-8 w-8 text-blue-400/20" />
        </div>
      </div>
    </div>
  );
};
