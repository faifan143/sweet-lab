import { useDeleteOrder, useUpdateOrderStatus } from '@/hooks/useOrders';
import { OrderResponseDto, OrderStatus } from '@/types/orders.type';
import { formatCurrency } from '@/utils/formatters';
import { AlertCircle, CheckCircle, Clock, CreditCard, Edit, RefreshCcw, ShoppingBag, Trash2, Truck, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import EditOrderModal from './EditOrderModal';

interface OrderDetailsModalProps {
    order: OrderResponseDto;
    isOpen: boolean;
    onClose: () => void;
    onOrderUpdated?: () => void;
    onConvertToInvoice?: (order: OrderResponseDto) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, isOpen, onClose, onOrderUpdated, onConvertToInvoice }) => {
    const [notes, setNotes] = useState<string>('');
    const { mutate: updateStatus, isPending: isUpdating, isSuccess: isUpdated } = useUpdateOrderStatus();
    const { mutate: deleteOrder, isPending: isDeleting, isSuccess: isDeleted } = useDeleteOrder();
    const [isConfirmingDelete, setIsConfirmingDelete] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    if (!isOpen) return null;

    const handleEditClick = () => {
        setIsEditModalOpen(true);
    };

    const handleEditSuccess = () => {
        setIsEditModalOpen(false);
        if (onOrderUpdated) {
            onOrderUpdated();
        }
    };

    const handleUpdateStatus = (status: OrderStatus) => {
        updateStatus({
            orderId: order.id!,
            status,
            notes: notes.trim() ? notes : undefined
        });
    };


    useEffect(() => {
        if (isUpdated || isDeleted) {
            onClose()
        }
    }, [isUpdated, isDeleted])

    const handleConvertToInvoiceClick = () => {
        if (onConvertToInvoice) {
            onConvertToInvoice(order);
        }
        // Removed onClose() to prevent immediate closing
    };

    const handleDeleteOrder = () => {
        if (isConfirmingDelete) {
            deleteOrder(order.id!);
            onClose();
        } else {
            setIsConfirmingDelete(true);
        }
    };

    const getStatusIcon = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.pending:
                return <Clock className="h-5 w-5 text-warning" />;
            case OrderStatus.processing:
                return <RefreshCcw className="h-5 w-5 text-blue-400" />;
            case OrderStatus.ready:
                return <CheckCircle className="h-5 w-5 text-info" />;
            case OrderStatus.delivered:
                return <Truck className="h-5 w-5 text-success" />;
            case OrderStatus.cancelled:
                return <AlertCircle className="h-5 w-5 text-danger" />;
            default:
                return <Clock className="h-5 w-5 text-warning" />;
        }
    };

    const getStatusText = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.pending:
                return "قيد الانتظار";
            case OrderStatus.processing:
                return "قيد التجهيز";
            case OrderStatus.ready:
                return "جاهز للتسليم";
            case OrderStatus.delivered:
                return "تم التسليم";
            case OrderStatus.cancelled:
                return "ملغي";
            default:
                return "قيد الانتظار";
        }
    };

    const getStatusClass = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.pending:
                return "text-warning bg-warning/10";
            case OrderStatus.processing:
                return "text-blue-400 bg-blue-400/10";
            case OrderStatus.ready:
                return "text-info bg-info/10";
            case OrderStatus.delivered:
                return "text-success bg-success/10";
            case OrderStatus.cancelled:
                return "text-danger bg-danger/10";
            default:
                return "text-warning bg-warning/10";
        }
    };

    return (
        <>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div
                    className="bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
                    dir="rtl"
                >
                    <div className="flex justify-between items-center p-4 border-b border-slate-700">
                        <div className="flex items-center gap-2">
                            <ShoppingBag className="h-5 w-5 text-slate-400" />
                            <h3 className="text-lg font-semibold text-slate-200">تفاصيل الطلب #{order.orderNumber}</h3>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleEditClick}
                                className="text-slate-400 hover:text-primary transition-colors rounded p-1 hover:bg-slate-700/50"
                                aria-label="تعديل الطلب"
                                title="تعديل الطلب"
                            >
                                <Edit className="h-5 w-5" />
                            </button>
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-200 transition-colors rounded p-1 hover:bg-slate-700/50"
                                aria-label="إغلاق"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="overflow-y-auto no-scrollbar p-4 max-h-[calc(90vh-120px)]">
                        {/* Order Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="bg-slate-700/30 p-4 rounded-lg">
                                <h4 className="text-slate-300 font-medium mb-3">معلومات العميل</h4>
                                <p className="text-slate-300 mb-1"><span className="text-slate-400">الاسم:</span> {order.customer?.name}</p>
                                <p className="text-slate-300 mb-1"><span className="text-slate-400">الهاتف:</span> {order.customer?.phone}</p>
                                {order.customer?.notes && (
                                    <p className="text-slate-300 mb-1"><span className="text-slate-400">ملاحظات:</span> {order.customer?.notes}</p>
                                )}
                            </div>
                            <div className="bg-slate-700/30 p-4 rounded-lg">
                                <h4 className="text-slate-300 font-medium mb-3">معلومات الطلب</h4>
                                <p className="text-slate-300 mb-1">
                                    <span className="text-slate-400">الحالة:</span>
                                    <span className={`mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status!)}`}>
                                        {getStatusIcon(order.status!)}
                                        <span className="mr-1">{getStatusText(order.status!)}</span>
                                    </span>
                                </p>
                                <p className="text-slate-300 mb-1"><span className="text-slate-400">التصنيف:</span> {order.category?.name}</p>
                                <p className="text-slate-300 mb-1"><span className="text-slate-400">تاريخ الطلب:</span> {order.createdAt ? new Date(order.createdAt).toLocaleString('ar-EG') : ''}</p>
                                {order.scheduledFor && (
                                    <p className="text-slate-300 mb-1"><span className="text-slate-400">موعد التسليم:</span> {new Date(order.scheduledFor).toLocaleString('ar-EG')}</p>
                                )}
                                <p className="text-slate-300 mb-1"><span className="text-slate-400">إجمالي المبلغ:</span> {formatCurrency(order.totalAmount)}</p>
                                <p className="text-slate-300 mb-1">
                                    <span className="text-slate-400">حالة الدفع:</span>
                                    <span className={`mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${order.paidStatus ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                                        {order.paidStatus ? 'مدفوع' : 'غير مدفوع'}
                                    </span>
                                </p>
                            </div>
                        </div>
                        {/* Order Items */}
                        <div className="bg-slate-700/30 p-4 rounded-lg mb-6">
                            <h4 className="text-slate-300 font-medium mb-3">عناصر الطلب</h4>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-600">
                                            <th className="py-2 px-3 text-right text-sm font-medium text-slate-300">المنتج</th>
                                            <th className="py-2 px-3 text-right text-sm font-medium text-slate-300">الكمية</th>
                                            <th className="py-2 px-3 text-right text-sm font-medium text-slate-300">الوحدة</th>
                                            <th className="py-2 px-3 text-right text-sm font-medium text-slate-300">السعر</th>
                                            <th className="py-2 px-3 text-right text-sm font-medium text-slate-300">الإجمالي</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700/30">
                                        {order.items.map((item) => (
                                            <tr key={item.id} className="hover:bg-slate-700/20">
                                                <td className="py-2 px-3 text-sm text-slate-300">{item.item?.name}</td>
                                                <td className="py-2 px-3 text-sm text-slate-300">{item.quantity}</td>
                                                <td className="py-2 px-3 text-sm text-slate-300">{item.unit}</td>
                                                <td className="py-2 px-3 text-sm text-slate-300">{formatCurrency(item.unitPrice)}</td>
                                                <td className="py-2 px-3 text-sm text-slate-300">{formatCurrency(item.quantity * item.unitPrice)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr className="bg-slate-700/40">
                                            <td colSpan={4} className="py-2 px-3 text-sm font-medium text-slate-300 text-left">الإجمالي</td>
                                            <td className="py-2 px-3 text-sm font-bold text-slate-200">{formatCurrency(order.totalAmount)}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>
                        {/* Notes */}
                        {order.notes && (
                            <div className="bg-slate-700/30 p-4 rounded-lg mb-6">
                                <h4 className="text-slate-300 font-medium mb-2">ملاحظات الطلب</h4>
                                <p className="text-slate-300">{order.notes}</p>
                            </div>
                        )}
                        {/* Action Notes */}
                        <div className="mb-6">
                            <label htmlFor="notes" className="block text-sm font-medium text-slate-300 mb-2">ملاحظات الإجراء</label>
                            <textarea
                                id="notes"
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full bg-slate-700/30 border border-slate-600 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                placeholder="أضف ملاحظات للإجراء..."
                            />
                        </div>
                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 mb-2">
                            {order.status === OrderStatus.processing && (
                                <button
                                    onClick={() => handleUpdateStatus(OrderStatus.ready)}
                                    disabled={isUpdating}
                                    className="bg-info hover:bg-info/80 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
                                >
                                    <CheckCircle className="h-4 w-4" />
                                    {isUpdating ? "يتم التعيين" : "تعيين كجاهز"}
                                </button>
                            )}
                            {order.status === OrderStatus.ready && (
                                <button
                                    onClick={() => handleUpdateStatus(OrderStatus.delivered)}
                                    disabled={isUpdating}
                                    className="bg-success hover:bg-success/80 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
                                >
                                    <Truck className="h-4 w-4" />
                                    {isUpdating ? "يتم التعيين" : "تعيين كمسلم"}
                                </button>
                            )}
                            {(order.status === OrderStatus.pending || order.status === OrderStatus.processing) && (
                                <button
                                    onClick={() => handleUpdateStatus(OrderStatus.cancelled)}
                                    disabled={isUpdating}
                                    className="bg-danger hover:bg-danger/80 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
                                >
                                    <AlertCircle className="h-4 w-4" />
                                    {isUpdating ? "يتم إلغاء الطلب" : "إلغاء الطلب"}
                                </button>
                            )}
                            {!order.paidStatus && (
                                <button
                                    onClick={handleConvertToInvoiceClick}
                                    className="bg-primary hover:bg-primary/80 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors"
                                >
                                    <CreditCard className="h-4 w-4" />
                                    تحويل لفاتورة
                                </button>
                            )}
                            <button
                                onClick={handleDeleteOrder}
                                disabled={isDeleting}
                                className={`bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors disabled:opacity-50 ${isConfirmingDelete ? 'bg-red-600' : ''}`}
                            >
                                <Trash2 className="h-4 w-4" />
                                {isConfirmingDelete ? 'تأكيد الحذف' : 'حذف الطلب'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Order Modal */}
            <EditOrderModal
                order={order}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={handleEditSuccess}
            />
        </>
    );
};

export default OrderDetailsModal;