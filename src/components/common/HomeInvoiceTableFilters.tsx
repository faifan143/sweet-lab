import { useMediaQuery } from "@mui/material";
import { motion } from "framer-motion";
import { ArrowUpCircle, ArrowDownCircle, Calendar, Filter } from "lucide-react";
import ActionButton from "./ActionButtons";
import { Role, useRoles } from "@/hooks/users/useRoles";

// Types
interface HomeInvoiceTableFiltersProps {
  dateFilter: string;
  statusFilter: "all" | "paid" | "unpaid";
  onDateFilterChange: (date: string) => void;
  onStatusFilterChange: (status: "all" | "paid" | "unpaid") => void;
  onAddIncome: () => void;
  onAddExpense: () => void;
}

type StatusOption = {
  value: "all" | "paid" | "unpaid";
  label: string;
};

const STATUS_OPTIONS: StatusOption[] = [
  { value: "all", label: "جميع الحالات" },
  { value: "paid", label: "نقدي" },
  { value: "unpaid", label: "آجل" },
];

export const HomeInvoiceTableFilters: React.FC<
  HomeInvoiceTableFiltersProps
> = ({
  dateFilter,
  statusFilter,
  onDateFilterChange,
  onStatusFilterChange,
  onAddIncome,
  onAddExpense,
}) => {
  const isMobile = useMediaQuery("(max-width:640px)");
  const { hasAnyRole } = useRoles();
  const filterContainerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
  };

  const filterItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={filterContainerVariants}
      className={`
        flex flex-col sm:flex-row items-stretch sm:items-center 
        justify-between gap-4  ${isMobile ? "space-y-4" : ""}
      `}
    >
      {/* Left Side - Filters */}
      <motion.div
        variants={filterItemVariants}
        className={`
          flex flex-col sm:flex-row items-stretch sm:items-center gap-4
          ${isMobile ? "w-full" : ""}
        `}
      >
        <div className="relative">
          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateFilterChange(e.target.value)}
            className={`
              bg-slate-700/50 border border-slate-600/50 rounded-lg 
              px-3 py-1.5 text-slate-200 focus:ring-2 focus:ring-slate-400/50
              transition-all duration-200 outline-none
              ${isMobile ? "w-full pl-3 pr-10" : "w-auto"}
              hover:border-slate-500/50
            `}
          />
        </div>

        <div className=" flex items-center gap-2">
          <Filter className=" h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) =>
              onStatusFilterChange(e.target.value as "all" | "paid" | "unpaid")
            }
            className={`
              bg-slate-700/50 border border-slate-600/50 rounded-lg 
              px-3 py-1.5 text-slate-200 focus:ring-2 focus:ring-slate-400/50
              transition-all duration-200 outline-none appearance-none
              ${isMobile ? "w-full pl-3 pr-10" : "w-auto"}
              hover:border-slate-500/50
            `}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Right Side - Action Buttons */}
      {hasAnyRole([Role.ADMIN, Role.ShiftManager]) && (
        <motion.div
          variants={filterItemVariants}
          className={`
          flex items-center gap-4
          ${isMobile ? "w-full" : ""}
        `}
        >
          <ActionButton
            icon={<ArrowDownCircle className="h-5 w-5" />}
            label="اضافة دخل"
            onClick={onAddIncome}
            variant="income"
            className={isMobile ? "flex-1" : ""}
          />
          <ActionButton
            icon={<ArrowUpCircle className="h-5 w-5" />}
            label="اضافة مصروف"
            onClick={onAddExpense}
            variant="expense"
            className={isMobile ? "flex-1" : ""}
          />
        </motion.div>
      )}
    </motion.div>
  );
};
