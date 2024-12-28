import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

// Interfaces
interface StatBoxProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: number;
}

const StatBox: React.FC<StatBoxProps> = ({
  title,
  value,
  icon: Icon,
  trend,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-slate-700/50"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-sky-400/10 rounded-lg">
          <Icon className="h-6 w-6 text-sky-400" />
        </div>
        <div>
          <h3 className="text-slate-400 text-sm">{title}</h3>
          <p className="text-slate-100 text-lg font-semibold">{value}</p>
        </div>
      </div>
      <div
        className={`text-sm ${trend > 0 ? "text-green-400" : "text-red-400"}`}
      >
        {trend > 0 ? "+" : ""}
        {trend}%
      </div>
    </div>
  </motion.div>
);

export default StatBox;
