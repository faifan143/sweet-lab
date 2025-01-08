"use client";
import { useMarkInvoiceAsPaid } from "@/hooks/invoices/useInvoice";
import { Invoice } from "@/types/invoice.type";
import { motion } from "framer-motion";
import { DollarSign, X } from "lucide-react";

interface StatusTransitionModalProps {
  invoice: Invoice;
  onClose: () => void;
  targetStatus: "paid" | "unpaid" | "debt";
}

const StatusTransitionModal: React.FC<StatusTransitionModalProps> = ({
  invoice,
  onClose,
  targetStatus,
}) => {
  const { mutateAsync: markInvoiceAsPaid, isPending } = useMarkInvoiceAsPaid();

  const handleConfirm = () => {
    markInvoiceAsPaid(
      { id: invoice.id, data: {} },
      {
        onSuccess: () => {
          console.log("Invoice successfully marked as paid.");
          onClose();
        },
        onError: (error) => {
          console.error("Error marking invoice as paid:", error);
        },
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-foreground/10 backdrop-blur-sm z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-card p-6 rounded-lg shadow-lg border border-border w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
        dir="rtl"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-foreground">
            {targetStatus === "paid" ? "تحويل إلى مدفوع" : "تحويل إلى دين"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Invoice Summary */}
          <div className="bg-muted rounded-lg p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">رقم الفاتورة</span>
                <span className="text-foreground font-medium">
                  #{invoice.invoiceNumber}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">المبلغ</span>
                <span className="text-foreground font-medium">
                  ${invoice.totalAmount.toLocaleString()}
                </span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">الخصم</span>
                  <span className="text-danger">
                    ${invoice.discount.toLocaleString()}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-border">
                <span className="text-muted-foreground">الصافي</span>
                <span className="text-success font-medium">
                  ${(invoice.totalAmount - invoice.discount).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={handleConfirm}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-success/10 text-success hover:bg-success/20 rounded-lg transition-colors"
            >
              <DollarSign className="h-5 w-5" />
              {isPending ? "جاري التاكيد" : "تأكيد"}
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-lg transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StatusTransitionModal;
