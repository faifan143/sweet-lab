import { motion } from "framer-motion";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant: "success" | "danger" | "income" | "expense";
  className?: string;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
  variant,
  className = "",
  disabled = false,
}) => {
  const variants = {
    success:
      "bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20",
    income: "bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border-sky-500/20",
    expense:
      "bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border-orange-500/20",
  };

  const baseClasses =
    "flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-colors duration-200";

  const combinedClasses = cn(
    baseClasses,
    variants[variant],
    disabled && "opacity-50 cursor-not-allowed",
    className
  );

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
};

function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export default ActionButton;
