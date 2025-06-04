"use client";
import { useCreateAudit } from "@/hooks/warehouse/useWarehouse";
import { formatCurrency } from "@/utils/formatters";
import { motion } from "framer-motion";
import { Check, Clipboard, Loader2, Plus, Save, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

interface AuditModalProps {
    isOpen: boolean;
    onClose: () => void;
    items: Array<{
        id: number;
        name: string;
        currentStock: number;
        defaultUnit?: string;
    }>;
}

interface AuditItem {
    itemId: number;
    name: string;
    currentStock: number;
    countedStock: number;
    defaultUnit?: string;
}

export const AuditModal = ({ isOpen, onClose, items }: AuditModalProps) => {
    const [auditItems, setAuditItems] = useState<AuditItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    const { mutateAsync: createAudit } = useCreateAudit();

    // Initialize audit items from items prop
    useEffect(() => {
        if (isOpen && items.length > 0) {
            const initialAuditItems = items.map(item => ({
                itemId: item.id,
                name: item.name,
                currentStock: item.currentStock,
                countedStock: item.currentStock, // Initialize with current stock
                defaultUnit: item.defaultUnit
            }));
            setAuditItems(initialAuditItems);
        }
    }, [isOpen, items]);

    // Filter items based on search term
    const filteredItems = auditItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Handle quantity change
    const handleQuantityChange = (itemId: number, value: number) => {
        setAuditItems(prev =>
            prev.map(item =>
                item.itemId === itemId
                    ? { ...item, countedStock: value }
                    : item
            )
        );
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            setSubmitting(true);

            // Format data for API
            const formattedData = {
                items: auditItems.map(item => ({
                    itemId: item.itemId,
                    countedStock: item.countedStock
                }))
            };

            await createAudit(formattedData);

            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 1500);
        } catch (error) {
            console.error("Error submitting audit:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

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
                className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 w-full max-w-4xl shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
                dir="rtl"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Clipboard className="h-6 w-6 text-blue-400" />
                        <h2 className="text-xl font-semibold text-white">جرد المخزون</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                        disabled={submitting}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="text"
                        className="w-full p-3 pr-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        placeholder="البحث عن مادة..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Table */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden mb-6">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-white/5">
                                <tr>
                                    <th className="text-right text-slate-200 p-4">اسم المادة</th>
                                    <th className="text-right text-slate-200 p-4">الكمية الحالية</th>
                                    <th className="text-right text-slate-200 p-4">الكمية المجرودة</th>
                                    <th className="text-right text-slate-200 p-4">الفرق</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredItems.length > 0 ? (
                                    filteredItems.map((item) => (
                                        <tr
                                            key={item.itemId}
                                            className="border-t border-white/10 hover:bg-white/5 transition-colors"
                                        >
                                            <td className="p-4 text-white">{item.name}</td>
                                            <td className="p-4 text-white">
                                                {item.currentStock} {item.defaultUnit}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={item.countedStock}
                                                        onChange={(e) => handleQuantityChange(item.itemId, Number(e.target.value))}
                                                        className="w-24 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                    />
                                                    <span className="text-slate-400">{item.defaultUnit}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-lg font-medium ${item.countedStock > item.currentStock
                                                        ? "bg-green-500/20 text-green-400"
                                                        : item.countedStock < item.currentStock
                                                            ? "bg-red-500/20 text-red-400"
                                                            : "bg-slate-500/20 text-slate-400"
                                                    }`}>
                                                    {item.countedStock - item.currentStock} {item.defaultUnit}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr className="border-t border-white/10">
                                        <td colSpan={4} className="p-6 text-center text-gray-400">
                                            لا توجد نتائج مطابقة للبحث
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white/5 text-slate-300 rounded-lg hover:bg-white/10 transition-colors"
                        disabled={submitting}
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || success}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 ${success
                                ? "bg-green-500/20 text-green-400"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                            } transition-colors`}
                    >
                        {submitting ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span>جاري الحفظ...</span>
                            </>
                        ) : success ? (
                            <>
                                <Check className="h-5 w-5" />
                                <span>تم الحفظ</span>
                            </>
                        ) : (
                            <>
                                <Save className="h-5 w-5" />
                                <span>حفظ الجرد</span>
                            </>
                        )}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}; 