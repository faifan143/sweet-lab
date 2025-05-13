import { Loader2 } from "lucide-react";
import React from "react";

interface ActionButtonsProps {
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  isPending: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  isSubmitting,
  onSubmit,
  onCancel,
  isPending
}) => {
  return (
    <div className="flex gap-4 pt-4">
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="flex-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>جاري الإنشاء...</span>
          </div>
        ) : (
          <span>تأكيد</span>
        )}
      </button>
      <button
        onClick={onCancel}
        className="flex-1 bg-slate-700/50 text-slate-300 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
      >
        إلغاء
      </button>
    </div>
  );
};

export default ActionButtons;