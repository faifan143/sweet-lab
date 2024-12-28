import { motion } from "framer-motion";

// Action Button Component
interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  variant: "success" | "danger" | "income" | "expense";
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon,
  label,
  onClick,
  variant,
}) => {
  const variants = {
    success:
      "bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border-red-500/20",
    income: "bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 border-sky-500/20",
    expense:
      "bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border-orange-500/20",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border ${variants[variant]} transition-colors duration-200`}
    >
      {icon}
      <span>{label}</span>
    </motion.button>
  );
};

export default ActionButton;
