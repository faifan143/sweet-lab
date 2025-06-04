"use client";
import { AuditEntry } from "@/types/warehouse.type";
import { formatDate } from "@/utils/formatters";
import { motion } from "framer-motion";
import { ClipboardList, Eye } from "lucide-react";

// Audit History Table Component
export const AuditHistoryTable = ({
    auditEntries,
    onViewDetails,
}: {
    auditEntries: AuditEntry[];
    onViewDetails: (audit: AuditEntry) => void;
}) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-white/5">
                    <tr>
                        <th className="text-right text-slate-200 p-4">رقم الجرد</th>
                        <th className="text-right text-slate-200 p-4">التاريخ</th>
                        <th className="text-right text-slate-200 p-4">عدد العناصر</th>
                        <th className="text-right text-slate-200 p-4">الإجراءات</th>
                    </tr>
                </thead>
                <tbody>
                    {auditEntries.length > 0 ? (
                        auditEntries.map((audit) => (
                            <tr
                                key={audit.id}
                                className="border-t border-white/10 hover:bg-white/5 transition-colors"
                            >
                                <td className="p-4 text-white">{audit.id}</td>
                                <td className="p-4 text-white">{audit.auditDate ? formatDate(audit.auditDate) : formatDate(audit.createdAt)}</td>
                                <td className="p-4 text-white">{audit.totalItemsCount || audit.items?.length || 0}</td>
                                <td className="p-4">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => onViewDetails(audit)}
                                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors"
                                    >
                                        <Eye className="h-4 w-4" />
                                        <span>عرض التفاصيل</span>
                                    </motion.button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr className="border-t border-white/10">
                            <td colSpan={4} className="p-6 text-center text-gray-400">
                                لا توجد عمليات جرد سابقة
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
); 