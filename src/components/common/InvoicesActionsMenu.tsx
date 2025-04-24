import React, { useState, useRef, useEffect } from "react";
import { Edit, Eye, FileText, Trash, DollarSign, FileX } from "lucide-react";
import { Invoice } from "@/types/invoice.type";
import BreakageConversionModal from "@/components/common/invoices/BreakageConversionModal";
import { useMarkInvoiceAsBreak } from "@/hooks/invoices/useInvoice";
import { useMokkBar } from "@/components/providers/MokkBarContext";
import { useMarkInvoiceAsPaid } from "@/hooks/invoices/useInvoice"; // New hook for marking as paid

interface InvoicesActionsMenuProps {
  invoice: Invoice;
  onViewDetails: (invoice: Invoice) => void;
  onEditInvoice: (invoice: Invoice) => void;
  onDeleteInvoice?: (invoice: Invoice) => void;
}

const InvoicesActionsMenu: React.FC<InvoicesActionsMenuProps> = ({
  invoice,
  onViewDetails,
  onEditInvoice,
  onDeleteInvoice,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBreakageModalOpen, setIsBreakageModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const markAsBreak = useMarkInvoiceAsBreak();
  const markAsPaid = useMarkInvoiceAsPaid(); // New hook
  const { setSnackbarConfig } = useMokkBar();

  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  const handleActionClick = (action: (invoice: Invoice) => void) => {
    action(invoice);
    setIsOpen(false);
  };

  // Handle marking invoice as paid
  const handleMarkAsPaid = async (invoice: Invoice) => {
    try {
      await markAsPaid.mutateAsync({ id: invoice.id, data: {} });
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم تحويل الفاتورة إلى مدفوع بنجاح",
      });
    } catch (error) {
      console.error("Error marking invoice as paid:", error);
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "حدث خطأ أثناء تحويل الفاتورة إلى مدفوع",
      });
    }
  };

  // Handle breakage conversion
  const handleConfirmBreakConversion = async (initialPayment: number, notes: string) => {
    try {
      await markAsBreak.mutateAsync({
        id: invoice.id,
        data: {
          initialPayment,
          notes,
        },
      });
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم تحويل الفاتورة إلى فاتورة كسر بنجاح",
      });
      setIsBreakageModalOpen(false);
    } catch (error) {
      console.error("Error converting to breakage:", error);
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "حدث خطأ أثناء تحويل الفاتورة إلى فاتورة كسر",
      });
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="text-blue-400 hover:text-blue-300 transition-colors p-1 rounded-full hover:bg-slate-700/50"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Actions menu"
        aria-expanded={isOpen}
      >
        <Eye className="h-5 w-5" />
      </button>

      {isOpen && (
        <div
          className="absolute z-30 bg-slate-800 border border-slate-700 rounded-lg shadow-xl py-2 px-1 
                      w-24 md:w-20
                      left-1/2 transform -translate-x-1/2 
                      md:left-0 md:transform-none md:-translate-x-0
                      top-full mt-1 md:top-0 md:-translate-y-2"
        >
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleActionClick(onViewDetails)}
              className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-sm px-2 py-1 rounded-md hover:bg-slate-700/50 w-full justify-start"
            >
              <FileText className="h-4 w-4" />
              عرض
            </button>
            <button
              onClick={() => handleActionClick(onEditInvoice)}
              className="text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 text-sm px-2 py-1 rounded-md hover:bg-slate-700/50 w-full justify-start"
            >
              <Edit className="h-4 w-4" />
              تعديل
            </button>
            {/* Show paid/breakage options only for unpaid invoices */}
            {!invoice.paidStatus && !invoice.isBreak && (
              <>
                <button
                  onClick={() => {
                    handleMarkAsPaid(invoice);
                    setIsOpen(false);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 text-sm px-2 py-1 rounded-md hover:bg-slate-700/50 w-full justify-start"
                >
                  <DollarSign className="h-4 w-4" />
                  مدفوع
                </button>
                {invoice.invoiceType === "income" && (
                  <button
                    onClick={() => {
                      setIsBreakageModalOpen(true);
                      setIsOpen(false);
                    }}
                    className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-sm px-2 py-1 rounded-md hover:bg-slate-700/50 w-full justify-start"
                  >
                    <FileX className="h-4 w-4" />
                    كسر
                  </button>
                )}
              </>
            )}
            {onDeleteInvoice && (
              <button
                onClick={() => handleActionClick(onDeleteInvoice)}
                className="text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 text-sm px-2 py-1 rounded-md hover:bg-slate-700/50 w-full justify-start"
              >
                <Trash className="h-4 w-4" />
                حذف
              </button>
            )}
          </div>
        </div>
      )}

      {/* Breakage Conversion Modal */}
      {isBreakageModalOpen && (
        <BreakageConversionModal
          invoice={invoice}
          onClose={() => setIsBreakageModalOpen(false)}
          onConfirm={handleConfirmBreakConversion}
          isProcessing={markAsBreak.isPending}
        />
      )}
    </div>
  );
};

export default InvoicesActionsMenu;