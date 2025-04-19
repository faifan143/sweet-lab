import { useFetchCustomers } from '@/hooks/customers/useCustomers';
import { useItems } from '@/hooks/items/useItems';
import { useCreateOrder, useOrderCategories } from '@/hooks/useOrders';
import { formatCurrency } from '@/utils/formatters';
import {
    AlertCircle,
    Calendar,
    CreditCard,
    DollarSign,
    FileText,
    Package,
    Plus,
    Save,
    Tag,
    User,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface OrderItem {
    itemId: string | number;
    quantity: number | string;
    unitPrice: number | string;
    unit: string;
    notes: string;
}

interface OrderFormData {
    customerId: string | number;
    categoryId: string | number;
    notes: string;
    paidStatus: boolean;
    isForToday: boolean;
    items: OrderItem[];
}

interface OrderErrors {
    customerId?: string;
    categoryId?: string;
    [key: string]: string | undefined;
}

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ isOpen, onClose }) => {
    const { data: customers, isLoading: isLoadingCustomers } = useFetchCustomers();
    const { data: categories, isLoading: isLoadingCategories } = useOrderCategories();
    const { data: items, isLoading: isLoadingItems } = useItems();
    const { mutate: createOrder, isPending } = useCreateOrder();

    const [formData, setFormData] = useState<OrderFormData>({
        customerId: '',
        categoryId: '',
        notes: '',
        paidStatus: false,
        isForToday: true,
        items: [{ itemId: '', quantity: 1, unitPrice: 0, unit: '', notes: '' }]
    });

    const [totalAmount, setTotalAmount] = useState<number>(0);
    const [errors, setErrors] = useState<OrderErrors>({});
    const [activeItemIndex, setActiveItemIndex] = useState<number>(0);
    const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);

    useEffect(() => {
        // Calculate total amount whenever order items change
        const total = formData.items.reduce((sum, item) => {
            return sum + (parseFloat(item.unitPrice as string) || 0) * (parseFloat(item.quantity as string) || 0);
        }, 0);
        setTotalAmount(total);
    }, [formData.items]);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setActiveItemIndex(0);
            setErrors({});
        }
    }, [isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        // Clear error when field is filled
        if (errors[name]) {
            setErrors({ ...errors, [name]: undefined });
        }
    };

    const handleItemChange = (index: number, field: keyof OrderItem, value: string | number) => {
        const updatedItems = [...formData.items];
        updatedItems[index] = { ...updatedItems[index], [field]: value };

        // If item changes, update unit and price if possible
        if (field === 'itemId' && items && value) {
            const selectedItem = items.find(item => item.id === parseInt(value as string));
            if (selectedItem && selectedItem.units && selectedItem.units.length > 0) {
                const defaultUnit = selectedItem.units.find(u => u.unit === selectedItem.defaultUnit) || selectedItem.units[0];
                updatedItems[index].unit = defaultUnit.unit;
                updatedItems[index].unitPrice = defaultUnit.price;
            }
        }

        setFormData({ ...formData, items: updatedItems });

        // Clear error when field is filled
        if (errors[`${field}-${index}`]) {
            setErrors({ ...errors, [`${field}-${index}`]: undefined });
        }
    };

    const addItem = () => {
        const newItems = [...formData.items, { itemId: '', quantity: 1, unitPrice: 0, unit: '', notes: '' }];
        setFormData({
            ...formData,
            items: newItems
        });
        setActiveItemIndex(newItems.length - 1);
    };

    const removeItem = (index: number) => {
        if (formData.items.length > 1) {
            const updatedItems = formData.items.filter((_, i) => i !== index);
            setFormData({ ...formData, items: updatedItems });

            // Adjust active index if needed
            if (activeItemIndex >= index && activeItemIndex > 0) {
                setActiveItemIndex(activeItemIndex - 1);
            }
        }
    };

    const validateForm = (): boolean => {
        const newErrors: OrderErrors = {};

        if (!formData.customerId) newErrors.customerId = 'الرجاء اختيار العميل';
        if (!formData.categoryId) newErrors.categoryId = 'الرجاء اختيار التصنيف';

        let hasItemErrors = false;
        formData.items.forEach((item, index) => {
            if (!item.itemId) {
                newErrors[`item-${index}`] = 'الرجاء اختيار المنتج';
                hasItemErrors = true;
            }
            if (!item.quantity || Number(item.quantity) <= 0) {
                newErrors[`quantity-${index}`] = 'الرجاء إدخال كمية صحيحة';
                hasItemErrors = true;
            }
            if (!item.unitPrice || Number(item.unitPrice) <= 0) {
                newErrors[`price-${index}`] = 'الرجاء إدخال سعر صحيح';
                hasItemErrors = true;
            }
            if (!item.unit) {
                newErrors[`unit-${index}`] = 'الرجاء اختيار الوحدة';
                hasItemErrors = true;
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateForm()) {
            // Scroll to first error
            const firstError = document.querySelector('.border-red-500');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        // Create order payload
        const orderData = {
            customerId: parseInt(formData.customerId as string),
            categoryId: parseInt(formData.categoryId as string),
            totalAmount,
            paidStatus: formData.paidStatus,
            notes: formData.notes,
            isForToday: formData.isForToday,
            items: formData.items.map(item => ({
                itemId: parseInt(item.itemId as string),
                quantity: parseFloat(item.quantity as string),
                unitPrice: parseFloat(item.unitPrice as string),
                unit: item.unit,
                notes: item.notes
            }))
        };

        createOrder(orderData, {
            onSuccess: () => {
                onClose();
                // Reset form
                setFormData({
                    customerId: '',
                    categoryId: '',
                    notes: '',
                    paidStatus: false,
                    isForToday: true,
                    items: [{ itemId: '', quantity: 1, unitPrice: 0, unit: '', notes: '' }]
                });
            }
        });
    };

    // Get selected customer name
    const getCustomerName = (): string => {
        if (!customers || !formData.customerId) return '';
        const customer = customers.find(c => c.id === parseInt(formData.customerId as string));
        return customer ? customer.name : '';
    };

    // Get selected category name
    const getCategoryName = (): string => {
        if (!categories || !formData.categoryId) return '';
        const category = categories.find(c => c.id === parseInt(formData.categoryId as string));
        return category ? category.name : '';
    };

    // Get available units for a specific item
    const getItemUnits = (itemId: string | number) => {
        if (!items || !itemId) return [];
        const item = items.find(i => i.id === parseInt(itemId as string));
        return item ? item.units : [];
    };

    // Get the selected item name for display
    const getItemName = (itemId: string | number): string => {
        if (!items || !itemId) return '';
        const item = items.find(i => i.id === parseInt(itemId as string));
        return item ? item.name : '';
    };

    // Format item card title
    const formatItemTitle = (index: number, item: OrderItem): string => {
        const itemName = getItemName(item.itemId);
        const amount = (parseFloat(item.unitPrice as string) || 0) * (parseFloat(item.quantity as string) || 0);

        if (!itemName) return `العنصر #${index + 1}`;
        return `${itemName} - ${formatCurrency(amount)}`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div
                className="bg-slate-800 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden"
                dir="rtl"
            >
                <div className="flex justify-between items-center p-4 border-b border-slate-700 bg-slate-900">
                    <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                        <Plus className="h-5 w-5 text-primary" />
                        إضافة طلب جديد
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-200 transition-colors rounded-full hover:bg-slate-700/50 p-1"
                        aria-label="إغلاق"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-120px)]">
                    {/* Customer and Category Section */}
                    <div className="bg-slate-850/60 p-4 border-b border-slate-700/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                            {/* Customer Selection */}
                            <div>
                                <label htmlFor="customerId" className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <User className="h-4 w-4 text-primary" />
                                    العميل *
                                </label>
                                <div className="relative">
                                    <select
                                        id="customerId"
                                        name="customerId"
                                        value={formData.customerId}
                                        onChange={handleInputChange}
                                        className={`w-full bg-slate-700/40 border ${errors.customerId ? 'border-red-500' : 'border-slate-600'} rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none`}
                                        disabled={isLoadingCustomers}
                                    >
                                        <option value="">اختر العميل</option>
                                        {customers?.map(customer => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-slate-400">
                                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.customerId &&
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.customerId}
                                    </p>
                                }
                                {formData.customerId && (
                                    <p className="text-primary text-xs mt-1">
                                        {getCustomerName()}
                                    </p>
                                )}
                            </div>

                            {/* Category Selection */}
                            <div>
                                <label htmlFor="categoryId" className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <Tag className="h-4 w-4 text-primary" />
                                    التصنيف *
                                </label>
                                <div className="relative">
                                    <select
                                        id="categoryId"
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleInputChange}
                                        className={`w-full bg-slate-700/40 border ${errors.categoryId ? 'border-red-500' : 'border-slate-600'} rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none`}
                                        disabled={isLoadingCategories}
                                    >
                                        <option value="">اختر التصنيف</option>
                                        {categories?.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-slate-400">
                                        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.categoryId &&
                                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.categoryId}
                                    </p>
                                }
                                {formData.categoryId && (
                                    <p className="text-primary text-xs mt-1">
                                        {getCategoryName()}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Delivery Option */}
                        <div className="flex items-center gap-2 mt-4 p-2 bg-slate-700/20 rounded-lg border border-slate-700/30 hover:border-primary/30 transition-colors cursor-pointer">
                            <input
                                type="checkbox"
                                id="isForToday"
                                name="isForToday"
                                checked={formData.isForToday}
                                onChange={handleInputChange}
                                className="rounded bg-slate-700/30 border-slate-600 text-primary focus:ring-primary/30"
                            />
                            <label htmlFor="isForToday" className="flex items-center gap-2 text-sm font-medium text-slate-300 cursor-pointer">
                                <Calendar className="h-4 w-4 text-warning" />
                                تسليم اليوم
                                <span className="text-xs text-slate-400 mr-2">(إذا لم يتم التحديد، سيتم جدولة التسليم للغد)</span>
                            </label>
                        </div>
                    </div>

                    {/* Items Section */}
                    <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-slate-300 font-medium flex items-center gap-2">
                                <Package className="h-4 w-4 text-primary" />
                                عناصر الطلب *
                            </h4>
                        </div>

                        {/* Items Tabs */}
                        <div className="flex mb-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                            {formData.items.map((item, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setActiveItemIndex(index)}
                                    className={`px-3 py-1.5 mr-2 rounded-lg text-sm whitespace-nowrap flex items-center gap-1 transition-all ${activeItemIndex === index
                                        ? 'bg-primary text-white shadow-md'
                                        : 'bg-slate-700/40 text-slate-300 hover:bg-slate-700/60'
                                        }`}
                                >
                                    {formatItemTitle(index, item)}
                                    {formData.items.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeItem(index);
                                            }}
                                            className="ml-2 p-0.5 rounded-full hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                                            aria-label="حذف العنصر"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    )}
                                </button>
                            ))}
                            <button
                                type="button"
                                onClick={addItem}
                                className="px-3 py-1.5 rounded-lg text-sm whitespace-nowrap flex items-center gap-1 bg-slate-700/20 text-slate-300 hover:bg-slate-700/40 transition-colors"
                            >
                                <Plus className="h-4 w-4" />
                                إضافة عنصر
                            </button>
                        </div>

                        {/* Active Item Form */}
                        <div className="bg-slate-700/20 p-4 rounded-lg mb-4 border border-slate-700/50 transition-all">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                {/* Item Selection */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                        <Package className="h-4 w-4 text-primary" />
                                        المنتج *
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.items[activeItemIndex].itemId}
                                            onChange={(e) => handleItemChange(activeItemIndex, 'itemId', e.target.value)}
                                            className={`w-full bg-slate-700/40 border ${errors[`item-${activeItemIndex}`] ? 'border-red-500' : 'border-slate-600'} rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none`}
                                            disabled={isLoadingItems}
                                        >
                                            <option value="">اختر المنتج</option>
                                            {items?.map(i => (
                                                <option key={i.id} value={i.id}>
                                                    {i.name}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-slate-400">
                                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors[`item-${activeItemIndex}`] &&
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors[`item-${activeItemIndex}`]}
                                        </p>
                                    }
                                    {formData.items[activeItemIndex].itemId && (
                                        <p className="text-primary text-xs mt-1">
                                            {getItemName(formData.items[activeItemIndex].itemId)}
                                        </p>
                                    )}
                                </div>

                                {/* Unit Selection */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                        <Tag className="h-4 w-4 text-primary" />
                                        الوحدة *
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={formData.items[activeItemIndex].unit}
                                            onChange={(e) => {
                                                const selectedUnit = getItemUnits(formData.items[activeItemIndex].itemId).find(u => u.unit === e.target.value);
                                                handleItemChange(activeItemIndex, 'unit', e.target.value);
                                                if (selectedUnit) {
                                                    handleItemChange(activeItemIndex, 'unitPrice', selectedUnit.price);
                                                }
                                            }}
                                            className={`w-full bg-slate-700/40 border ${errors[`unit-${activeItemIndex}`] ? 'border-red-500' : 'border-slate-600'} rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none`}
                                            disabled={!formData.items[activeItemIndex].itemId}
                                        >
                                            <option value="">اختر الوحدة</option>
                                            {getItemUnits(formData.items[activeItemIndex].itemId).map((unit, i) => (
                                                <option key={i} value={unit.unit}>
                                                    {unit.unit} - {formatCurrency(unit.price)}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-3 text-slate-400">
                                            <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors[`unit-${activeItemIndex}`] &&
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors[`unit-${activeItemIndex}`]}
                                        </p>
                                    }
                                    {formData.items[activeItemIndex].unit && (
                                        <p className="text-primary text-xs mt-1">
                                            {formData.items[activeItemIndex].unit}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-3">
                                {/* Quantity */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                        <DollarSign className="h-4 w-4 text-primary" />
                                        الكمية *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.items[activeItemIndex].quantity}
                                        onChange={(e) => handleItemChange(activeItemIndex, 'quantity', e.target.value)}
                                        className={`w-full bg-slate-700/40 border ${errors[`quantity-${activeItemIndex}`] ? 'border-red-500' : 'border-slate-600'} rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                                        min="0.01"
                                        step="0.01"
                                    />
                                    {errors[`quantity-${activeItemIndex}`] &&
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors[`quantity-${activeItemIndex}`]}
                                        </p>
                                    }
                                </div>

                                {/* Unit Price */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                        <DollarSign className="h-4 w-4 text-primary" />
                                        سعر الوحدة *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.items[activeItemIndex].unitPrice}
                                        onChange={(e) => handleItemChange(activeItemIndex, 'unitPrice', e.target.value)}
                                        className={`w-full bg-slate-700/40 border ${errors[`price-${activeItemIndex}`] ? 'border-red-500' : 'border-slate-600'} rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                                        min="0.01"
                                        step="0.01"
                                    />
                                    {errors[`price-${activeItemIndex}`] &&
                                        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors[`price-${activeItemIndex}`]}
                                        </p>
                                    }
                                </div>
                            </div>

                            {/* Item Notes */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
                                    <FileText className="h-4 w-4 text-primary" />
                                    ملاحظات العنصر
                                </label>
                                <input
                                    type="text"
                                    value={formData.items[activeItemIndex].notes}
                                    onChange={(e) => handleItemChange(activeItemIndex, 'notes', e.target.value)}
                                    className="w-full bg-slate-700/40 border border-slate-600 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    placeholder="أضف ملاحظات لهذا العنصر (اختياري)"
                                />
                            </div>

                            {/* Item Total */}
                            <div className="mt-3 p-2 bg-slate-700/30 rounded-lg flex items-center justify-between">
                                <span className="text-sm text-slate-300">إجمالي العنصر:</span>
                                <span className="font-bold text-primary">
                                    {formatCurrency(
                                        (parseFloat(formData.items[activeItemIndex].unitPrice as string) || 0) *
                                        (parseFloat(formData.items[activeItemIndex].quantity as string) || 0)
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Order Notes and Payment Section */}
                    <div className="p-4 border-t border-slate-700/30 bg-slate-900/20">
                        {/* Notes Toggle */}
                        <div className="mb-4">
                            <button
                                type="button"
                                onClick={() => setIsEditingNotes(!isEditingNotes)}
                                className="flex items-center justify-between w-full p-2 bg-slate-700/20 rounded-lg hover:bg-slate-700/30 transition-colors"
                            >
                                <span className="flex items-center gap-2 text-sm font-medium text-slate-300">
                                    <FileText className="h-4 w-4 text-primary" />
                                    ملاحظات الطلب
                                </span>
                                <span className="text-xs text-slate-400">
                                    {isEditingNotes ? 'إغلاق' : formData.notes ? 'تعديل الملاحظات' : 'إضافة ملاحظات'}
                                </span>
                            </button>

                            {isEditingNotes && (
                                <div className="mt-2">
                                    <textarea
                                        id="notes"
                                        name="notes"
                                        rows={3}
                                        value={formData.notes}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-700/40 border border-slate-600 rounded-lg p-2 text-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                        placeholder="أضف ملاحظات للطلب (اختياري)"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Payment Status */}
                        <div className="flex items-center gap-2 p-3 bg-slate-700/20 rounded-lg border border-slate-700/30 hover:border-primary/30 transition-colors cursor-pointer mb-4">
                            <input
                                type="checkbox"
                                id="paidStatus"
                                name="paidStatus"
                                checked={formData.paidStatus}
                                onChange={handleInputChange}
                                className="rounded bg-slate-700/30 border-slate-600 text-primary focus:ring-primary/30"
                            />
                            <label htmlFor="paidStatus" className="flex items-center gap-2 text-sm font-medium text-slate-300 cursor-pointer w-full">
                                <CreditCard className="h-4 w-4 text-primary" />
                                تم الدفع
                            </label>
                        </div>

                        {/* Order Total */}
                        <div className="bg-slate-700/40 p-4 rounded-lg mb-4 border border-slate-700/50 shadow-inner">
                            <div className="flex justify-between items-center">
                                <h4 className="text-slate-300 font-medium flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-primary" />
                                    إجمالي الطلب:
                                </h4>
                                <p className="text-xl font-bold text-primary">{formatCurrency(totalAmount)}</p>
                            </div>
                        </div>

                        {/* Form Buttons */}
                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
                            >
                                <X className="h-4 w-4" />
                                إلغاء
                            </button>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                {isPending ? (
                                    <>
                                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                                        جاري الحفظ...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        حفظ الطلب
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOrderModal;