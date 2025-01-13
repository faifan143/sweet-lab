// src/components/invoices/InvoiceTabs.tsx
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

type InvoiceStatus = "paid" | "unpaid" | "debt";

interface InvoiceTabsProps {
  activeStatus: InvoiceStatus;
  onStatusChange: (status: InvoiceStatus) => void;
}

export const InvoiceTabs = ({
  activeStatus,
  onStatusChange,
}: InvoiceTabsProps) => {
  return (
    <div
      className="border-b border-slate-700/50 mb-6 w-full overflow-x-auto no-scrollbar "
      dir="rtl"
    >
      <div className="flex min-w-full sm:min-w-0 px-2">
        <button
          onClick={() => onStatusChange("paid")}
          className={`px-4 py-2 -mb-px text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeStatus === "paid"
              ? "text-success border-b-2 border-success"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <CheckCircle className="h-4 w-4" />
          <span>الفواتير المدفوعة</span>
        </button>
        <button
          onClick={() => onStatusChange("unpaid")}
          className={`px-4 py-2 -mb-px text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeStatus === "unpaid"
              ? "text-danger border-b-2 border-danger"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          <span>الفواتير غير المدفوعة</span>
        </button>
        <button
          onClick={() => onStatusChange("debt")}
          className={`px-4 py-2 -mb-px text-sm font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeStatus === "debt"
              ? "text-warning border-b-2 border-warning"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="h-4 w-4" />
          <span>فواتير الدين</span>
        </button>
      </div>
    </div>
  );
};
