"use client";
import { useCreateCategory, useDeleteCategory, useUpdateCategory } from "@/hooks/customers/useCustomersCategories";
import {
    CustomerCategory,
    CreateCategoryRequest,
    UpdateCategoryRequest,
} from "@/types/customerCategories.types";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Loader2, Tag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface CustomerCategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "create" | "update" | "delete";
    categoryData: CustomerCategory | null;
}

type FormValues = CreateCategoryRequest | UpdateCategoryRequest;

const CustomerCategoryModal: React.FC<CustomerCategoryModalProps> = ({
    isOpen,
    onClose,
    mode = "create",
    categoryData = null,
}) => {
    const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
        null
    );

    // React Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm<FormValues>({
        defaultValues: {
            name: "",
            description: "",
        },
    });

    // Custom hooks for API operations
    const { mutateAsync: createCategory, isPending: isCreating } = useCreateCategory();
    const { mutateAsync: updateCategory, isPending: isUpdating } = useUpdateCategory();
    const { mutateAsync: deleteCategory, isPending: isDeleting } = useDeleteCategory();

    // Reset form when modal opens/closes or mode changes
    useEffect(() => {
        if (isOpen) {
            if (mode === "update" && categoryData) {
                setValue("name", categoryData.name || "");
                setValue("description", categoryData.description || "");
            } else if (mode === "create") {
                reset({
                    name: "",
                    description: "",
                });
            }
        }

        // Reset status when modal opens/closes
        setSubmitStatus(null);
    }, [isOpen, mode, categoryData, reset, setValue]);

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setSubmitStatus(null);

        try {
            if (mode === "create") {
                await createCategory(data as CreateCategoryRequest);
            } else if (mode === "update" && categoryData) {
                await updateCategory({
                    id: categoryData.id,
                    ...data,
                } as any);
            }

            setSubmitStatus("success");

            // Close modal after successful operation (with delay for user to see success message)
            setTimeout(() => {
                onClose();
                // Reset form if it was a create operation
                if (mode === "create") {
                    reset();
                }
            }, 1500);
        } catch (error) {
            console.error("Error submitting form:", error);
            setSubmitStatus("error");
        }
    };

    const handleDelete = async () => {
        if (!categoryData || !categoryData.id) return;

        try {
            await deleteCategory(categoryData.id);
            setSubmitStatus("success");
            setTimeout(() => {
                onClose();
            }, 1500);
        } catch (error) {
            console.error("Error deleting category:", error);
            setSubmitStatus("error");
        }
    };

    const modalTitle = {
        create: "إضافة تصنيف جديد",
        update: "تعديل بيانات التصنيف",
        delete: "حذف التصنيف",
    }[mode];

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-slate-800/95 backdrop-blur-md p-6 rounded-xl shadow-2xl w-full max-w-md mx-4"
                    onClick={(e) => e.stopPropagation()}
                    dir="rtl"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-slate-100">{modalTitle}</h2>
                        <button
                            onClick={onClose}
                            className="text-slate-400 hover:text-slate-300 transition-colors w-8 h-8 flex items-center justify-center rounded-full bg-slate-700/50 hover:bg-slate-700"
                            type="button"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Success Message */}
                    {submitStatus === "success" && (
                        <div className="mb-6 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-3">
                            <CheckCircle className="h-5 w-5 text-emerald-400" />
                            <span className="text-emerald-400">
                                {mode === "create"
                                    ? "تم إضافة التصنيف بنجاح"
                                    : mode === "update"
                                        ? "تم تحديث بيانات التصنيف بنجاح"
                                        : "تم حذف التصنيف بنجاح"}
                            </span>
                        </div>
                    )}

                    {/* Error Message */}
                    {submitStatus === "error" && (
                        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                            <span className="text-red-400">
                                {mode === "create"
                                    ? "حدث خطأ أثناء إضافة التصنيف"
                                    : mode === "update"
                                        ? "حدث خطأ أثناء تحديث بيانات التصنيف"
                                        : "حدث خطأ أثناء حذف التصنيف"}
                            </span>
                        </div>
                    )}

                    {mode === "delete" ? (
                        // Delete Confirmation
                        <div className="space-y-6">
                            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-center">
                                <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-3" />
                                <h3 className="text-lg font-medium text-red-400 mb-2">
                                    تأكيد الحذف
                                </h3>
                                <p className="text-slate-300">
                                    {`هل أنت متأكد من أنك تريد حذف التصنيف "${categoryData?.name}"؟`}
                                </p>
                                {categoryData?.customers && categoryData.customers.length > 0 && (
                                    <p className="text-yellow-400 text-sm mt-2 p-2 bg-yellow-500/10 rounded-lg">
                                        تنبيه: هذا التصنيف مرتبط بـ {categoryData.customers.length} عميل. حذف التصنيف سيؤدي إلى إزالة ربط العملاء بهذا التصنيف.
                                    </p>
                                )}
                                <p className="text-slate-400 text-sm mt-2">
                                    هذا الإجراء لا يمكن التراجع عنه.
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                                    disabled={isDeleting}
                                    type="button"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 px-4 py-2 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors flex items-center justify-center gap-2"
                                    disabled={isDeleting}
                                    type="button"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            جاري الحذف...
                                        </>
                                    ) : (
                                        "تأكيد الحذف"
                                    )}
                                </button>
                            </div>
                        </div>
                    ) : (
                        // Create/Update Form
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="space-y-4">
                                {/* Category Icon */}
                                <div className="flex justify-center mb-2">
                                    <div className="h-16 w-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                                        <Tag className="h-8 w-8 text-purple-400" />
                                    </div>
                                </div>

                                {/* Name Field */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-slate-300 mb-1"
                                    >
                                        اسم التصنيف <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        {...register("name", {
                                            required: "اسم التصنيف مطلوب",
                                            minLength: {
                                                value: 2,
                                                message: "الاسم يجب أن يكون على الأقل حرفين",
                                            },
                                        })}
                                        className={`w-full px-3 py-2 bg-slate-700/50 border ${errors.name ? "border-red-500/50" : "border-slate-600/50"
                                            } rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30`}
                                        placeholder="أدخل اسم التصنيف"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-400">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                {/* Description Field */}
                                <div>
                                    <label
                                        htmlFor="description"
                                        className="block text-sm font-medium text-slate-300 mb-1"
                                    >
                                        وصف التصنيف
                                    </label>
                                    <textarea
                                        id="description"
                                        {...register("description")}
                                        rows={3}
                                        className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30"
                                        placeholder="أضف وصفاً للتصنيف (اختياري)"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-2 rounded-lg bg-purple-500 hover:bg-purple-600 text-white transition-colors flex items-center justify-center gap-2"
                                    disabled={isCreating || isUpdating}
                                >
                                    {(isCreating || isUpdating) && (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    )}
                                    {mode === "create"
                                        ? isCreating
                                            ? "جاري الإضافة..."
                                            : "إضافة التصنيف"
                                        : isUpdating
                                            ? "جاري التحديث..."
                                            : "تحديث البيانات"}
                                </button>
                            </div>
                        </form>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CustomerCategoryModal;