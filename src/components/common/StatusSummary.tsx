// src/components/invoices/StatusSummary.tsx
import { Invoice } from "@/types/invoice.type";

interface StatusSummaryProps {
  invoices?: Invoice[];
}

export const StatusSummary = ({ invoices = [] }: StatusSummaryProps) => {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full sm:w-auto"
      dir="rtl"
    >
      <div className="bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50 min-w-[120px]">
        <p className="text-slate-400 text-sm">المدفوعة</p>
        <p className="text-emerald-400 text-lg font-semibold">
          {invoices.filter((inv) => inv.paidStatus).length || 0}
        </p>
      </div>
      <div className="bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50 min-w-[120px]">
        <p className="text-slate-400 text-sm">غير المدفوعة</p>
        <p className="text-red-400 text-lg font-semibold">
          {invoices.filter(
            (inv) => !inv.paidStatus && inv.invoiceCategory !== "debt"
          ).length || 0}
        </p>
      </div>
      <div className="bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50 min-w-[120px]">
        <p className="text-slate-400 text-sm">الديون</p>
        <p className="text-yellow-400 text-lg font-semibold">
          {invoices.filter(
            (inv) => !inv.paidStatus && inv.invoiceCategory === "debt"
          ).length || 0}
        </p>
      </div>
    </div>
  );
};
