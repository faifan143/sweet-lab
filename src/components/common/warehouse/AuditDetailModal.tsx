"use client";
import { AuditEntry } from "@/types/warehouse.type";
import { formatDate } from "@/utils/formatters";
import { motion } from "framer-motion";
import { Clipboard, X } from "lucide-react";

interface AuditDetailModalProps {
    audit: AuditEntry | null;
    isOpen: boolean;
    onClose: () => void;
}

export const AuditDetailModal = ({
    audit,
    isOpen,
    onClose,
}: AuditDetailModalProps) => {
    if (!isOpen || !audit) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 w-full max-w-4xl shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto no-scrollbar"
                onClick={(e) => e.stopPropagation()}
                dir="rtl"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Clipboard className="h-6 w-6 text-blue-400" />
                        <h2 className="text-xl font-semibold text-white">
                            تفاصيل الجرد #{audit.id}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Audit Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                        <div className="text-sm text-slate-400 mb-1">رقم الجرد</div>
                        <div className="text-white font-medium">{audit.id}</div>
                    </div>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                        <div className="text-sm text-slate-400 mb-1">تاريخ الجرد</div>
                        <div className="text-white font-medium">
                            {audit.auditDate ? formatDate(audit.auditDate) : formatDate(audit.createdAt)}
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                {(audit.employeeId || audit.employee || audit.notes || audit.totalItemsCount) && (
                    <div className="grid grid-cols-1 gap-4 mb-6">
                        {audit.employee && (
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                                <div className="text-sm text-slate-400 mb-1">الموظف</div>
                                <div className="text-white font-medium">{audit.employee.name}</div>
                            </div>
                        )}

                        {audit.notes && (
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                                <div className="text-sm text-slate-400 mb-1">ملاحظات</div>
                                <div className="text-white font-medium">{audit.notes}</div>
                            </div>
                        )}

                        {audit.totalItemsCount !== undefined && (
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                                <div className="text-sm text-slate-400 mb-1">عدد العناصر</div>
                                <div className="text-white font-medium">{audit.totalItemsCount}</div>
                            </div>
                        )}

                        {audit.totalValueDifference !== undefined && (
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4">
                                <div className="text-sm text-slate-400 mb-1">فرق القيمة</div>
                                <div className="text-white font-medium">{audit.totalValueDifference}</div>
                            </div>
                        )}
                    </div>
                )}

                {/* Table - Only show if items array exists */}
                {audit.items && audit.items.length > 0 && (
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden mb-6">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="text-right text-slate-200 p-4">اسم المادة</th>
                                        <th className="text-right text-slate-200 p-4">الكمية المجرودة</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {audit.items.map((item) => (
                                        <tr
                                            key={item.itemId}
                                            className="border-t border-white/10 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="p-4 text-white">{item.item?.name || `مادة #${item.itemId}`}</td>
                                            <td className="p-4 text-white">
                                                {item.countedStock} {item.item?.defaultUnit}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Message when no items */}
                {(!audit.items || audit.items.length === 0) && (
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center text-slate-400 mb-6">
                        {audit.totalItemsCount && audit.totalItemsCount > 0
                            ? `تم جرد ${audit.totalItemsCount} عنصر، لكن التفاصيل غير متوفرة`
                            : "لا توجد عناصر في هذا الجرد"
                        }
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white/5 text-slate-300 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        إغلاق
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}; 