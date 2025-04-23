import React, { useState, useEffect } from 'react';
import {
    X,
    Tag,
    Edit,
    Trash2,
    Plus,
    Save,
    Check,
    AlertTriangle,
    Loader2,
    ShoppingBag,
    CheckCircle,
    User
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useOrderCategories, useCreateOrderCategory, useUpdateOrderCategory, useDeleteOrderCategory } from '@/hooks/useOrders';
import { OrdersCategoriesFetchDto, OrdersCategoriesCreateDto, OrderCategoryUpdateDto } from '@/types/orders.type';

interface CategoryManagementModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CategoryManagementModal: React.FC<CategoryManagementModalProps> = ({
    isOpen,
    onClose
}) => {
    // Fetch categories
    const {
        data: categories = [],
        isLoading,
        error: categoriesError,
        refetch
    } = useOrderCategories();

    // Create category mutation
    const {
        mutate: createCategory,
        isPending: isCreating,
        error: createError
    } = useCreateOrderCategory();

    // Update category mutation
    const {
        mutate: updateCategory,
        isPending: isUpdating,
        error: updateError
    } = useUpdateOrderCategory();

    // Delete category mutation
    const {
        mutate: deleteCategory,
        isPending: isDeleting,
        error: deleteError
    } = useDeleteOrderCategory();

    // State
    const [selectedCategory, setSelectedCategory] = useState<OrdersCategoriesFetchDto | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isCreatingNew, setIsCreatingNew] = useState(false);
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryDescription, setNewCategoryDescription] = useState('');
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
    const [successMessage, setSuccessMessage] = useState('');

    // Reset state when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            resetState();
        }
    }, [isOpen]);

    // Reset state
    const resetState = () => {
        setSelectedCategory(null);
        setIsEditing(false);
        setIsCreatingNew(false);
        setIsConfirmingDelete(false);
        setNewCategoryName('');
        setNewCategoryDescription('');
        setFormErrors({});
        setSuccessMessage('');
    };

    // Select a category to view
    const handleSelectCategory = (category: OrdersCategoriesFetchDto) => {
        setSelectedCategory(category);
        setIsEditing(false);
        setIsCreatingNew(false);
        setIsConfirmingDelete(false);
        setFormErrors({});
    };

    // Create new category
    const handleCreateCategory = () => {
        // Validate
        const errors: { [key: string]: string } = {};
        if (!newCategoryName.trim()) {
            errors.name = 'اسم التصنيف مطلوب';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // Submit
        createCategory({
            name: newCategoryName.trim(),
            description: newCategoryDescription.trim()
        }, {
            onSuccess: () => {
                setSuccessMessage('تم إنشاء التصنيف بنجاح');
                refetch();
                setIsCreatingNew(false);
                setNewCategoryName('');
                setNewCategoryDescription('');
                setFormErrors({});

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            },
            onError: () => {
                setFormErrors({
                    general: 'حدث خطأ أثناء إنشاء التصنيف'
                });
            }
        });
    };

    // Edit category
    const handleEditCategory = () => {
        if (!selectedCategory) return;
        setIsEditing(true);
        setNewCategoryName(selectedCategory.name);
        setNewCategoryDescription(selectedCategory.description || '');
        setFormErrors({});
    };

    // Update category
    const handleUpdateCategory = () => {
        if (!selectedCategory) return;

        // Validate
        const errors: { [key: string]: string } = {};
        if (!newCategoryName.trim()) {
            errors.name = 'اسم التصنيف مطلوب';
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        // Submit update
        updateCategory({
            orderCategoryId: selectedCategory.id,
            data: {
                name: newCategoryName.trim(),
                description: newCategoryDescription.trim()
            }
        }, {
            onSuccess: () => {
                setSuccessMessage('تم تحديث التصنيف بنجاح');
                setIsEditing(false);
                refetch();

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            },
            onError: () => {
                setFormErrors({
                    general: 'حدث خطأ أثناء تحديث التصنيف'
                });
            }
        });
    };

    // Delete category
    const handleDeleteCategory = () => {
        if (!selectedCategory) return;

        if (!isConfirmingDelete) {
            setIsConfirmingDelete(true);
            return;
        }

        // Submit delete
        deleteCategory(selectedCategory.id, {
            onSuccess: () => {
                setSuccessMessage('تم حذف التصنيف بنجاح');
                setSelectedCategory(null);
                setIsConfirmingDelete(false);
                refetch();

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            },
            onError: () => {
                setFormErrors({
                    general: 'حدث خطأ أثناء حذف التصنيف'
                });
                setIsConfirmingDelete(false);
            }
        });
    };

    // If the modal is not open, don't render anything
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
                className="bg-slate-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
                dir="rtl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-900 sticky top-0 z-10">
                    <h3 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                        <Tag className="h-5 w-5 text-primary" />
                        إدارة تصنيفات الطلبات
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors rounded-full hover:bg-slate-700/50 p-1"
                        aria-label="إغلاق"
                        type="button"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mx-4 mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>{successMessage}</span>
                    </div>
                )}

                {/* Error Message */}
                {(categoriesError || createError || updateError || deleteError || formErrors.general) && (
                    <div className="mx-4 mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        <span>{formErrors.general || 'حدث خطأ أثناء تحميل البيانات'}</span>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(90vh-80px)]">
                    {/* Categories List */}
                    <div className="md:col-span-1 border-r border-slate-700/50 p-4 overflow-y-auto bg-slate-800">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-slate-200 font-medium flex items-center gap-2">
                                <Tag className="h-4 w-4 text-blue-400" />
                                التصنيفات
                            </h4>
                            <button
                                onClick={() => {
                                    setIsCreatingNew(!isCreatingNew);
                                    setSelectedCategory(null);
                                    setIsEditing(false);
                                    setIsConfirmingDelete(false);
                                    setNewCategoryName('');
                                    setNewCategoryDescription('');
                                    setFormErrors({});
                                }}
                                className={`p-2 rounded-full ${isCreatingNew
                                    ? 'bg-slate-700/50 text-slate-300'
                                    : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                    } transition-colors`}
                                aria-label={isCreatingNew ? 'إلغاء' : 'إضافة تصنيف جديد'}
                            >
                                {isCreatingNew ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                            </button>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center p-6">
                                <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
                            </div>
                        ) : categories.length === 0 ? (
                            <div className="text-center p-6 bg-slate-700/30 rounded-lg border border-slate-700/50 text-slate-400">
                                لا توجد تصنيفات متاحة
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {categories.map(category => (
                                    <div
                                        key={category.id}
                                        onClick={() => handleSelectCategory(category)}
                                        className={`p-3 rounded-lg cursor-pointer transition-all ${selectedCategory?.id === category.id
                                            ? 'bg-blue-500/20 text-blue-300'
                                            : 'bg-slate-700/30 text-slate-200 hover:bg-slate-700'
                                            } border ${selectedCategory?.id === category.id ? 'border-blue-500/50' : 'border-slate-700/50'}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Tag className="h-4 w-4 text-slate-400" />
                                            <h5 className="font-medium">{category.name}</h5>
                                        </div>
                                        <div className="flex items-center justify-between mt-2 text-sm">
                                            <span className="text-slate-400">
                                                {category.customersCount} عملاء
                                            </span>
                                            <span className="text-slate-400">
                                                {category._count.orders} طلبات
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Category Details / Create Form */}
                    <div className="md:col-span-2 p-6 overflow-y-auto bg-slate-800">
                        {isCreatingNew ? (
                            // Create New Category Form
                            <div>
                                <h4 className="text-slate-200 font-medium mb-6 flex items-center gap-2">
                                    <Plus className="h-5 w-5 text-emerald-400" />
                                    إضافة تصنيف جديد
                                </h4>

                                <div className="space-y-6">
                                    <div>
                                        <label htmlFor="categoryName" className="block text-sm font-medium text-slate-300 mb-2">
                                            اسم التصنيف *
                                        </label>
                                        <div className="relative">
                                            <Tag className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                            <input
                                                id="categoryName"
                                                type="text"
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                className={`w-full pl-4 pr-12 py-2 bg-slate-700/50 border ${formErrors.name ? 'border-red-500/50' : 'border-slate-600/50'} rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
                                                placeholder="أدخل اسم التصنيف"
                                            />
                                        </div>
                                        {formErrors.name && (
                                            <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="categoryDescription" className="block text-sm font-medium text-slate-300 mb-2">
                                            وصف التصنيف
                                        </label>
                                        <div className="relative">
                                            <Edit className="absolute right-3 top-4 h-5 w-5 text-slate-400" />
                                            <textarea
                                                id="categoryDescription"
                                                value={newCategoryDescription}
                                                onChange={(e) => setNewCategoryDescription(e.target.value)}
                                                className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 min-h-[100px] resize-none"
                                                placeholder="أدخل وصف التصنيف (اختياري)"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsCreatingNew(false)}
                                            className="px-6 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                                        >
                                            إلغاء
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleCreateCategory}
                                            disabled={isCreating}
                                            className="px-6 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors disabled:opacity-50 flex items-center gap-2"
                                        >
                                            {isCreating ? (
                                                <>
                                                    <Loader2 className="h-5 w-5 animate-spin" />
                                                    جاري الإنشاء...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="h-5 w-5" />
                                                    إنشاء التصنيف
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : selectedCategory ? (
                            // Category Details / Edit Form
                            <div>
                                {isEditing ? (
                                    // Edit Form
                                    <div>
                                        <h4 className="text-slate-200 font-medium mb-6 flex items-center gap-2">
                                            <Edit className="h-5 w-5 text-amber-400" />
                                            تعديل التصنيف
                                        </h4>

                                        <div className="space-y-6">
                                            <div>
                                                <label htmlFor="editCategoryName" className="block text-sm font-medium text-slate-300 mb-2">
                                                    اسم التصنيف *
                                                </label>
                                                <div className="relative">
                                                    <Tag className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                                    <input
                                                        id="editCategoryName"
                                                        type="text"
                                                        value={newCategoryName}
                                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                                        className={`w-full pl-4 pr-12 py-2 bg-slate-700/50 border ${formErrors.name ? 'border-red-500/50' : 'border-slate-600/50'} rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30`}
                                                        placeholder="أدخل اسم التصنيف"
                                                    />
                                                </div>
                                                {formErrors.name && (
                                                    <p className="text-red-400 text-sm mt-1">{formErrors.name}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label htmlFor="editCategoryDescription" className="block text-sm font-medium text-slate-300 mb-2">
                                                    وصف التصنيف
                                                </label>
                                                <div className="relative">
                                                    <Edit className="absolute right-3 top-4 h-5 w-5 text-slate-400" />
                                                    <textarea
                                                        id="editCategoryDescription"
                                                        value={newCategoryDescription}
                                                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                                                        className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30 min-h-[100px] resize-none"
                                                        placeholder="أدخل وصف التصنيف (اختياري)"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex justify-end gap-3 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(false)}
                                                    className="px-6 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                                                >
                                                    إلغاء
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleUpdateCategory}
                                                    disabled={isUpdating}
                                                    className="px-6 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    {isUpdating ? (
                                                        <>
                                                            <Loader2 className="h-5 w-5 animate-spin" />
                                                            جاري التحديث...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Check className="h-5 w-5" />
                                                            حفظ التغييرات
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // View Details
                                    <div>
                                        <div className="flex justify-between items-start mb-6">
                                            <h4 className="text-xl font-bold text-slate-200 flex items-center gap-2">
                                                <Tag className="h-5 w-5 text-primary" />
                                                {selectedCategory.name}
                                            </h4>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleEditCategory}
                                                    className="p-2 rounded-full bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 transition-colors"
                                                    aria-label="تعديل"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={handleDeleteCategory}
                                                    disabled={isDeleting}
                                                    className={`p-2 rounded-full ${isConfirmingDelete
                                                        ? 'bg-red-500/30 text-red-400'
                                                        : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                                        } transition-colors disabled:opacity-50`}
                                                    aria-label={isConfirmingDelete ? 'تأكيد الحذف' : 'حذف'}
                                                >
                                                    {isDeleting ? (
                                                        <Loader2 className="h-5 w-5 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="h-5 w-5" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            {selectedCategory.description && (
                                                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-700/50">
                                                    <h5 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                                        <Edit className="h-4 w-4 text-slate-400" />
                                                        الوصف
                                                    </h5>
                                                    <p className="text-slate-200">{selectedCategory.description}</p>
                                                </div>
                                            )}

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-700/50">
                                                    <h5 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                                        <User className="h-4 w-4 text-blue-400" />
                                                        العملاء
                                                    </h5>
                                                    <p className="text-2xl font-bold text-blue-400">{selectedCategory.customersCount}</p>
                                                </div>
                                                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-700/50">
                                                    <h5 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                                        <ShoppingBag className="h-4 w-4 text-emerald-400" />
                                                        الطلبات
                                                    </h5>
                                                    <p className="text-2xl font-bold text-emerald-400">{selectedCategory._count.orders}</p>
                                                </div>
                                            </div>

                                            {/* Customers List */}
                                            {selectedCategory.customers && selectedCategory.customers.length > 0 ? (
                                                <div className="mt-6">
                                                    <h5 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                                                        <User className="h-4 w-4 text-blue-400" />
                                                        العملاء في هذا التصنيف
                                                    </h5>
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                                                        {selectedCategory.customers.map(customer => (
                                                            <div key={customer.id} className="bg-slate-700/30 p-4 rounded-lg border border-slate-700/50">
                                                                <h6 className="font-medium text-slate-200">{customer.name}</h6>
                                                                <p className="text-sm text-slate-400 mt-1">{customer.phone || 'لا يوجد رقم هاتف'}</p>
                                                                {customer.notes && (
                                                                    <p className="text-sm text-slate-400 mt-1">ملاحظات: {customer.notes}</p>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-700/50 text-center text-slate-400">
                                                    لا يوجد عملاء في هذا التصنيف
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            // No category selected
                            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                                <Tag className="h-16 w-16 text-slate-600 mb-4" />
                                <h4 className="text-slate-200 text-xl font-bold mb-2">اختر تصنيفًا لعرض تفاصيله</h4>
                                <p className="text-slate-400 max-w-md">
                                    يمكنك اختيار تصنيف من القائمة على اليمين لعرض تفاصيله، أو إنشاء تصنيف جديد بالضغط على زر الإضافة.
                                </p>
                                <button
                                    onClick={() => setIsCreatingNew(true)}
                                    className="mt-6 px-6 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2"
                                >
                                    <Plus className="h-5 w-5" />
                                    إنشاء تصنيف جديد
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CategoryManagementModal;