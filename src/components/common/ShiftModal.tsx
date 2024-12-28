import { motion } from "framer-motion";
import { X, Sun, Moon } from "lucide-react";

export type ShiftType = "صباحي" | "مسائي" | null;

interface ShiftModalProps {
  onClose: () => void;
  onSelect: (type: ShiftType) => void;
}

// Shift Selection Modal Component
const ShiftModal: React.FC<ShiftModalProps> = ({ onClose, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-slate-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-100">اختر نوع الوردية</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4" dir="rtl">
          <button
            onClick={() => onSelect("صباحي")}
            className="flex flex-col items-center gap-3 p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors group"
          >
            <Sun className="w-8 h-8 text-yellow-400 group-hover:text-yellow-300" />
            <span className="text-slate-200">وردية صباحية</span>
          </button>

          <button
            onClick={() => onSelect("مسائي")}
            className="flex flex-col items-center gap-3 p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors group"
          >
            <Moon className="w-8 h-8 text-blue-400 group-hover:text-blue-300" />
            <span className="text-slate-200">وردية مسائية</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShiftModal;
