import { Role, useRoles } from "@/hooks/users/useRoles";
import { motion } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle, Calendar, Filter, Search } from "lucide-react";
import { useState } from "react";

// Types
interface HomeInvoiceTableFiltersProps {
  dateFilter: string;
  statusFilter: "all" | "paid" | "unpaid";
  searchTerm?: string; // Added search functionality
  onDateFilterChange: (date: string) => void;
  onStatusFilterChange: (status: "all" | "paid" | "unpaid") => void;
  onSearchChange?: (search: string) => void; // Added search handler
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
  searchTerm = "",
  onDateFilterChange,
  onStatusFilterChange,
  onSearchChange,
  onAddIncome,
  onAddExpense,
}) => {
    const { hasAnyRole } = useRoles();
    const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

    // Animation variants
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
        className="space-y-3"
      >
        {/* Main Controls Row */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Bar - Always visible */}
          {onSearchChange && (
            <motion.div
              variants={filterItemVariants}
              className="relative flex-1"
            >
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="بحث في الفواتير..."
                className="w-full pr-10 pl-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg 
                text-slate-200 focus:ring-2 focus:ring-slate-400/50 transition-all duration-200 outline-none"
              />
            </motion.div>
          )}

          {/* Filter Toggle (Mobile Only) */}
          <div className="sm:hidden flex gap-3">
            <motion.button
              variants={filterItemVariants}
              onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
              className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg
              text-slate-200 hover:bg-slate-700 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>الفلاتر</span>
            </motion.button>

            {/* Action Buttons (Mobile) */}
            {hasAnyRole([Role.ADMIN, Role.ShiftManager]) && (
              <div className="flex gap-2 flex-1">
                <ActionButton
                  icon={<ArrowDownCircle className="h-5 w-5" />}
                  onClick={onAddIncome}
                  variant="income"
                  className="flex-1"
                  label="إضافة دخل"
                />
                <ActionButton
                  icon={<ArrowUpCircle className="h-5 w-5" />}
                  onClick={onAddExpense}
                  variant="expense"
                  className="flex-1"
                  label="إضافة صرف"
                />
              </div>
            )}
          </div>

          {/* Action Buttons (Desktop) */}
          {hasAnyRole([Role.ADMIN, Role.ShiftManager]) && (
            <motion.div
              variants={filterItemVariants}
              className="hidden sm:flex items-center gap-3"
            >
              <ActionButton
                icon={<ArrowDownCircle className="h-5 w-5" />}
                label="اضافة دخل"
                onClick={onAddIncome}
                variant="income"
              />
              <ActionButton
                icon={<ArrowUpCircle className="h-5 w-5" />}
                label="اضافة مصروف"
                onClick={onAddExpense}
                variant="expense"
              />
            </motion.div>
          )}
        </div>

        {/* Expanded Filters (Mobile) */}
        {isFiltersExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-2 gap-3 sm:hidden"
          >
            <div className="relative">
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => onDateFilterChange(e.target.value)}
                className="w-full pl-3 pr-10 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg 
                text-slate-200 focus:ring-2 focus:ring-slate-400/50 transition-all duration-200 outline-none"
              />
            </div>

            <div className="relative">
              <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) =>
                  onStatusFilterChange(e.target.value as "all" | "paid" | "unpaid")
                }
                className="w-full appearance-none pl-3 pr-10 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg 
                text-slate-200 focus:ring-2 focus:ring-slate-400/50 transition-all duration-200 outline-none"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </motion.div>
        )}

        {/* Desktop Filters - Always visible on desktop */}
        <motion.div
          variants={filterItemVariants}
          className="hidden sm:flex items-center gap-3"
        >
          <div className="relative">
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
              className="bg-slate-700/50 border border-slate-600/50 rounded-lg 
              pl-3 pr-10 py-2 text-slate-200 focus:ring-2 focus:ring-slate-400/50
              transition-all duration-200 outline-none hover:border-slate-500/50"
            />
          </div>

          <div className="relative">
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) =>
                onStatusFilterChange(e.target.value as "all" | "paid" | "unpaid")
              }
              className="bg-slate-700/50 border border-slate-600/50 rounded-lg 
              pl-3 pr-10 py-2 text-slate-200 focus:ring-2 focus:ring-slate-400/50
              transition-all duration-200 outline-none appearance-none
              hover:border-slate-500/50"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      </motion.div>
    );
  };




interface ActionButtonProps {
  icon: React.ReactNode;
  label?: string;
  onClick: () => void;
  variant: "income" | "expense" | "neutral";
  className?: string;
  iconOnly?: boolean;
  tooltip?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
  variant,
  className = "",
  iconOnly = false,
  tooltip
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "income":
        return "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20";
      case "expense":
        return "bg-red-500/10 text-red-400 hover:bg-red-500/20";
      default:
        return "bg-slate-700/50 text-slate-300 hover:bg-slate-700";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg 
        transition-colors ${getVariantClasses()} ${className}`}
      title={tooltip || label}
    >
      {icon}
      {!iconOnly && label && <span>{label}</span>}
    </button>
  );
};


export default HomeInvoiceTableFilters;
