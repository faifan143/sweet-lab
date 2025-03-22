// src/components/invoices/StatusSummary.tsx
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/axios";
import { Loader2 } from "lucide-react";

// Define the summary type
interface InvoiceSummary {
  paid: number;
  unpaid: number;
  debt: number;
}

// Function to fetch summary from API
const fetchInvoiceSummary = async (): Promise<InvoiceSummary> => {
  const response = await apiClient.get<InvoiceSummary>("/invoices/summary");
  return response;
};

export const StatusSummary = () => {
  // Use a separate query for summary statistics
  const { data: summary, isLoading } = useQuery<InvoiceSummary>({
    queryKey: ["invoicesSummary"],
    queryFn: fetchInvoiceSummary,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span className="text-slate-400">جاري تحميل الإحصائيات...</span>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full sm:w-auto"
      dir="rtl"
    >
      <div className="bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50 min-w-[120px]">
        <p className="text-slate-400 text-sm">المدفوعة</p>
        <p className="text-emerald-400 text-lg font-semibold">
          {summary?.paid || 0}
        </p>
      </div>
      <div className="bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50 min-w-[120px]">
        <p className="text-slate-400 text-sm">غير المدفوعة</p>
        <p className="text-red-400 text-lg font-semibold">
          {summary?.unpaid || 0}
        </p>
      </div>
      <div className="bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50 min-w-[120px]">
        <p className="text-slate-400 text-sm">الديون</p>
        <p className="text-yellow-400 text-lg font-semibold">
          {summary?.debt || 0}
        </p>
      </div>
    </div>
  );
};
