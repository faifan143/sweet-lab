import { InvoiceCategory } from "@/types/invoice.type";
import { X } from "lucide-react";
import React from "react";

interface ModalHeaderProps {
  onClose: () => void;
  type: InvoiceCategory;
  mode: "income" | "expense";
}

const ModalHeader: React.FC<ModalHeaderProps> = ({ onClose, type, mode }) => {
  const getTitle = () => {
    switch (type) {
      case InvoiceCategory.PRODUCTS:
        return mode === "income" ? "فاتورة بيع جديدة" : "فاتورة شراء جديدة";
      case InvoiceCategory.DIRECT:
        return mode === "income" ? "دخل مباشر جديد" : "مصروف مباشر جديد";
      case InvoiceCategory.DEBT:
        return mode === "income" ? "تحصيل دين" : "تسجيل دين جديد";
      case InvoiceCategory.ADVANCE:
        return mode === "income" ? "استلام سلفة" : "إرجاع سلفة";
      case InvoiceCategory.EMPLOYEE:
        if (mode === "income") {
          return "معاملة موظف - دخل";
        } else {
          return "معاملة موظف - مصروف";
        }
      default:
        return "معاملة جديدة";
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-300 transition-colors"
      >
        <X className="h-6 w-6" />
      </button>
      <h2 className="text-xl font-bold text-slate-100">{getTitle()}</h2>
    </div>
  );
};

export default ModalHeader;