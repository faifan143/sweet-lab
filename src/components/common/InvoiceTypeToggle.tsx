// InvoiceTypeToggle.tsx
import { motion } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

interface InvoiceTypeToggleProps {
  activeType: "income" | "expense";
  onToggle: (type: "income" | "expense") => void;
}

export const InvoiceTypeToggle: React.FC<InvoiceTypeToggleProps> = ({
  activeType,
  onToggle,
}) => {
  return (
    <div className="flex items-center gap-2 bg-slate-700/50 p-1 rounded-lg">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onToggle("income")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          activeType === "income"
            ? "bg-emerald-500/20 text-emerald-400"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <ArrowDownCircle className="h-4 w-4" />
        <span>فواتير الدخل</span>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onToggle("expense")}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
          activeType === "expense"
            ? "bg-red-500/20 text-red-400"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <ArrowUpCircle className="h-4 w-4" />
        <span>فواتير الصرف</span>
      </motion.button>
    </div>
  );
};
