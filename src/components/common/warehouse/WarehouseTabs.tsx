import { Package, Receipt } from "lucide-react";

export const WarehouseTabs = ({
  activeTab,
  onTabChange,
}: {
  activeTab: "materials" | "invoices";
  onTabChange: (tab: "materials" | "invoices") => void;
}) => (
  <div className="flex justify-center mb-8">
    <div className="inline-flex bg-white/5 rounded-lg p-1">
      <button
        onClick={() => onTabChange("materials")}
        className={`
          px-6 py-2 rounded-lg transition-colors flex items-center gap-2
          ${
            activeTab === "materials"
              ? "bg-purple-500/20 text-purple-400"
              : "text-slate-300 hover:bg-white/10"
          }
        `}
      >
        <Package className="h-5 w-5" />
        المواد المخزنة
      </button>
      <button
        onClick={() => onTabChange("invoices")}
        className={`
          px-6 py-2 rounded-lg transition-colors flex items-center gap-2
          ${
            activeTab === "invoices"
              ? "bg-purple-500/20 text-purple-400"
              : "text-slate-300 hover:bg-white/10"
          }
        `}
      >
        <Receipt className="h-5 w-5" />
        فواتير المشتريات
      </button>
    </div>
  </div>
);
