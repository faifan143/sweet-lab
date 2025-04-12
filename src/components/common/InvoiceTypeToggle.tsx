// InvoiceTypeToggle.tsx
import { motion } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface InvoiceTypeToggleProps {
  activeType: "income" | "expense";
  onToggle: (type: "income" | "expense") => void;
}

export const InvoiceTypeToggle: React.FC<InvoiceTypeToggleProps> = ({
  activeType,
  onToggle,
}) => {
  // Track window width for responsive behavior
  const [isMobile, setIsMobile] = useState(false);

  // Update isMobile state based on window width
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint in Tailwind
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Get the text and style for each button based on type
  const getButtonConfig = (type: "income" | "expense") => {
    const isActive = activeType === type;

    const text = type === "income" ? "فواتير الدخل" : "فواتير الصرف";
    const icon = type === "income" ?
      <ArrowDownCircle className={`h-${isMobile ? '5' : '4'} w-${isMobile ? '5' : '4'}`} /> :
      <ArrowUpCircle className={`h-${isMobile ? '5' : '4'} w-${isMobile ? '5' : '4'}`} />;

    const baseClasses = "flex items-center justify-center gap-2 rounded-lg transition-all";
    const activeClasses = type === "income"
      ? "bg-emerald-500/20 text-emerald-400"
      : "bg-red-500/20 text-red-400";
    const inactiveClasses = "text-slate-400 hover:text-slate-200";

    return {
      text,
      icon,
      className: `${baseClasses} ${isActive ? activeClasses : inactiveClasses} ${isMobile
        ? isActive ? "flex-1 py-3" : "flex-1 py-3"
        : "px-4 py-2"
        }`
    };
  };

  const incomeConfig = getButtonConfig("income");
  const expenseConfig = getButtonConfig("expense");

  return (
    <div className={`flex items-center ${isMobile ? 'w-full' : ''} gap-2 bg-slate-700/50 p-1 rounded-lg`}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onToggle("income")}
        className={incomeConfig.className}
      >
        {incomeConfig.icon}
        {/* Always show text on larger screens, but hide on mobile when not active */}
        <span className={isMobile && activeType !== "income" ? "" : ""}>
          {incomeConfig.text}
        </span>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onToggle("expense")}
        className={expenseConfig.className}
      >
        {expenseConfig.icon}
        {/* Always show text on larger screens, but hide on mobile when not active */}
        <span className={isMobile && activeType !== "expense" ? "" : ""}>
          {expenseConfig.text}
        </span>
      </motion.button>
    </div>
  );
};

// Alternative implementation using CSS-only responsive approach:

export const InvoiceTypeToggleCssOnly: React.FC<InvoiceTypeToggleProps> = ({
  activeType,
  onToggle,
}) => {
  return (
    <div className="flex items-center w-full sm:w-auto gap-2 bg-slate-700/50 p-1 rounded-lg">
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onToggle("income")}
        className={`flex items-center justify-center sm:justify-start gap-2 flex-1 sm:flex-initial px-3 sm:px-4 py-3 sm:py-2 rounded-lg transition-all ${activeType === "income"
          ? "bg-emerald-500/20 text-emerald-400"
          : "text-slate-400 hover:text-slate-200"
          }`}
      >
        <ArrowDownCircle className="h-5 sm:h-4 w-5 sm:w-4" />
        <span className={activeType !== "income" ? "" : ""}>
          فواتير الدخل
        </span>
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onToggle("expense")}
        className={`flex items-center justify-center sm:justify-start gap-2 flex-1 sm:flex-initial px-3 sm:px-4 py-3 sm:py-2 rounded-lg transition-all ${activeType === "expense"
          ? "bg-red-500/20 text-red-400"
          : "text-slate-400 hover:text-slate-200"
          }`}
      >
        <ArrowUpCircle className="h-5 sm:h-4 w-5 sm:w-4" />
        <span className={activeType !== "expense" ? "" : ""}>
          فواتير الصرف
        </span>
      </motion.button>
    </div>
  );
};

export default InvoiceTypeToggle;