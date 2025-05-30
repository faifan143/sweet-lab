import { useConvertOrderToInvoice } from '@/hooks/useOrders';
import { OrderResponseDto } from '@/types/orders.type';
import { formatCurrency } from '@/utils/formatters';
import { motion } from 'framer-motion';
import {
    Calculator,
    DollarSign,
    FileText,
    Loader2,
    ShoppingBag,
    ToggleRight,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface InvoiceOrderConversionModalProps {
    order: OrderResponseDto;
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const InvoiceOrderConversionModal: React.FC<InvoiceOrderConversionModalProps> = ({
    order,
    isOpen,
    onClose,
    onSuccess
}) => {
    // State
    const [trayCount, setTrayCount] = useState<number>(0);
    const [discount, setDiscount] = useState<number>(0);
    const [additionalAmount, setAdditionalAmount] = useState<number>(0);
    const [initialPayment, setInitialPayment] = useState<number>(0);
    const [isBreak, setIsBreak] = useState<boolean>(false);
    const [notes, setNotes] = useState<string>('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Initialize with order data
    useEffect(() => {
        if (order) {
            setNotes(order.notes || '');
        }
    }, [order]);

    // Calculate total amount
    const totalAmount = order
        ? order.totalAmount - discount + additionalAmount
        : 0;

    // Convert to invoice mutation
    const {
        mutate: convertToInvoice,
        isPending
    } = useConvertOrderToInvoice();

    // Handle form submission
    const handleSubmit = () => {
        // Validate
        const newErrors: { [key: string]: string } = {};
        if (trayCount < 0) {
            newErrors.trayCount = 'لا يمكن أن يكون عدد الفوارغ أقل من صفر';
        }
        if (discount < 0) {
            newErrors.discount = 'لا يمكن أن يكون الخصم أقل من صفر';
        }
        if (additionalAmount < 0) {
            newErrors.additionalAmount = 'لا يمكن أن يكون المبلغ الإضافي أقل من صفر';
        }
        if (isBreak && initialPayment < 0) {
            newErrors.initialPayment = 'لا يمكن أن يكون الدفع المبدئي أقل من صفر';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            const firstError = document.querySelector('.border-red-500');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Submit data
        convertToInvoice({
            orderId: order.id!,
            data: {
                notes: notes.trim() || undefined,
                trayCount,
                discount,
                additionalAmount,
                initialPayment: isBreak ? initialPayment : undefined, // Only include initialPayment if isBreak is true
                isBreak,
            }
        }, {
            onSuccess: () => {
                if (onSuccess) onSuccess();
                onClose();
            }
        });
    };

    if (!isOpen || !order) return null;

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
                className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto no-scrollbar"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-300 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <h2 className="text-xl font-bold text-slate-100">تحويل الطلب إلى فاتورة</h2>
                </div>

                <div className="space-y-6" dir="rtl">
                    {/* Order Summary */}
                    <div className="bg-slate-700/30 p-4 rounded-lg">
                        <h4 className="text-slate-200 font-medium mb-3">معلومات الطلب الأساسية</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-slate-400 text-sm">رقم الطلب:</p>
                                <p className="text-slate-200">#{order.orderNumber}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">العميل:</p>
                                <p className="text-slate-200">{order.customer?.name || 'غير معروف'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">التصنيف:</p>
                                <p className="text-slate-200">{order.category?.name || 'غير معروف'}</p>
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">المبلغ الأصلي:</p>
                                <p className="text-slate-200">{formatCurrency(order.totalAmount)}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tray Count - Always Rendered */}
                    <div className="space-y-2">
                        <label className="block text-slate-200">عدد الفوارغ</label>
                        <div className="relative">
                            <input
                                id="trayCount"
                                type="number"
                                value={trayCount}
                                onChange={(e) => setTrayCount(Number(e.target.value))}
                                className={`w-full px-4 py-2 bg-slate-700/50 border ${errors.trayCount ? 'border-red-500/50' : 'border-slate-600/50'} rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
                                min="0"
                                placeholder="عدد الفوارغ"
                            />
                            {errors.trayCount && (
                                <div className="text-red-400 text-sm mt-1">
                                    {errors.trayCount}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Discount - Always Rendered */}
                    <div className="space-y-2">
                        <label className="block text-slate-200">الخصم</label>
                        <div className="relative">
                            <Calculator className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                id="discount"
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(Number(e.target.value))}
                                className={`w-full pl-4 pr-12 py-2 bg-slate-700/50 border ${errors.discount ? 'border-red-500/50' : 'border-slate-600/50'} rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
                                min="0"
                                placeholder="قيمة الخصم"
                            />
                            {errors.discount && (
                                <div className="text-red-400 text-sm mt-1">
                                    {errors.discount}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Additional Amount - Always Rendered */}
                    <div className="space-y-2">
                        <label className="block text-slate-200">المبلغ الإضافي</label>
                        <div className="relative">
                            <Calculator className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                            <input
                                id="additionalAmount"
                                type="number"
                                value={additionalAmount}
                                onChange={(e) => setAdditionalAmount(Number(e.target.value))}
                                className={`w-full pl-4 pr-12 py-2 bg-slate-700/50 border ${errors.additionalAmount ? 'border-red-500/50' : 'border-slate-600/50'} rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
                                min="0"
                                placeholder="قيمة المبلغ الإضافي"
                            />
                            {errors.additionalAmount && (
                                <div className="text-red-400 text-sm mt-1">
                                    {errors.additionalAmount}
                                </div>
                            )}
                            <p className="text-xs text-slate-400">
                                يمكنك إضافة مبلغ إضافي على الطلب مثل قيمة التوصيل أو رسوم إضافية
                            </p>
                        </div>
                    </div>

                    {/* Is Break */}
                    <div className="space-y-2 flex items-center gap-4">
                        <label className="block text-slate-200">هل فاتورة كسر؟</label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIsBreak(!isBreak)}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isBreak ? 'bg-blue-500' : 'bg-slate-600'}`}
                            >
                                <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isBreak ? '-translate-x-6' : '-translate-x-1'}`}
                                />
                            </button>
                        </div>
                    </div>

                    {/* Initial Payment - Conditionally Rendered when isBreak is true */}
                    {isBreak && (
                        <div className="space-y-2">
                            <label className="block text-slate-200">دفعة أولى</label>
                            <div className="relative">
                                <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    id="initialPayment"
                                    type="number"
                                    value={initialPayment}
                                    onChange={(e) => setInitialPayment(Number(e.target.value))}
                                    className={`w-full pl-4 pr-12 py-2 bg-slate-700/50 border ${errors.initialPayment ? 'border-red-500/50' : 'border-slate-600/50'} rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
                                    min="0"
                                    placeholder="قيمة الدفعة الأولى"
                                />
                                {errors.initialPayment && (
                                    <div className="text-red-400 text-sm mt-1">
                                        {errors.initialPayment}
                                    </div>
                                )}
                                <p className="text-xs text-slate-400">
                                    أدخل المبلغ المدفوع كدفعة أولى (إن وجد)
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Final Total */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <div className="space-y-2">
                            <label className="block text-slate-200">الإجمالي بعد الخصم والإضافات</label>
                            <div className="relative">
                                <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                <input
                                    type="text"
                                    readOnly
                                    value={totalAmount}
                                    className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Notes - Always Rendered */}
                    <div className="space-y-2">
                        <label className="block text-slate-200">ملاحظات</label>
                        <div className="relative">
                            <FileText className="absolute right-3 top-4 h-5 w-5 text-slate-400" />
                            <textarea
                                id="notes"
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                                placeholder="أدخل أي ملاحظات إضافية حول الطلب..."
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isPending}
                            className="px-6 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    جاري التحويل...
                                </>
                            ) : (
                                <>
                                    <ShoppingBag className="h-5 w-5" />
                                    تحويل إلى فاتورة
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default InvoiceOrderConversionModal;