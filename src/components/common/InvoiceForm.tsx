"use client";
import { CustomerType, useCustomersList } from "@/hooks/customers/useCustomers";
import {
  useCreateDirectDebt,
  useCreateExpenseProducts,
  useCreateIncomeProducts,
} from "@/hooks/invoices/useInvoice";
import { useItemGroups } from "@/hooks/items/useItemGroups";
import { useItems } from "@/hooks/items/useItems";
import {
  DirectDebtDTO,
  ExpenseProductsDTO,
  IncomeProductsDTO,
  Invoice,
  InvoiceCategory,
  Item,
} from "@/types/invoice.type";
import { motion } from "framer-motion";
import {
  Calculator,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Loader2,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { useMokkBar } from "../providers/MokkBarContext";

type InvoiceType = Invoice["invoiceType"];
type PaymentType = "cash" | "credit";

interface InvoiceFormProps {
  type: InvoiceCategory;
  mode: InvoiceType;
  fundId: number;
  onClose: () => void;
}

interface FormData {
  customerId?: number;
  customerName?: string;
  customerPhone?: string;
  paymentType: PaymentType;
  totalAmount: number;
  discount: number;
  paidStatus: boolean;
  notes?: string;
}

interface FormItem {
  id: number;
  quantity: number;
  unitPrice: number;
  unit: string;
  trayCount?: number;
  subTotal: number;
  itemId: number;
  item: Item;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  type,
  mode,
  fundId,
  onClose,
}) => {
  const { setSnackbarConfig } = useMokkBar();
  const { data: customers } = useCustomersList();
  const { data: items } = useItems();
  const { data: itemGroups } = useItemGroups();

  const isPurchaseInvoice = mode === "expense";

  // State
  const [formData, setFormData] = useState<FormData>({
    paymentType: "cash",
    totalAmount: 0,
    discount: 0,
    paidStatus: true,
  });

  const [formItems, setFormItems] = useState<FormItem[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [selectedItemPrice, setSelectedItemPrice] = useState<number>(0);
  const [selectedItemUnit, setSelectedItemUnit] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [trayCount, setTrayCount] = useState<number>(0);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(
    null
  );

  // Mutations with success/error handling
  const createIncomeProducts = useCreateIncomeProducts({
    onSuccess: () => {
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم إضافة الفاتورة بنجاح",
      });
      onClose();
    },
    onError: (error) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.message || "حدث خطأ أثناء إضافة الفاتورة",
      });
    },
  });

  const createExpenseProducts = useCreateExpenseProducts({
    onSuccess: () => {
      setSnackbarConfig({
        open: true,
        severity: "success",
        message: "تم إضافة فاتورة الشراء بنجاح",
      });
      onClose();
    },
    onError: (error) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message:
          error?.response?.data?.message || "حدث خطأ أثناء إضافة فاتورة الشراء",
      });
    },
  });

  const createDirectDebt = useCreateDirectDebt({
    onSuccess: () => {
      setSnackbarConfig({
        open: true,
        severity: "success",
        message:
          type === "debt" ? "تم تسجيل الدين بنجاح" : "تم إضافة المعاملة بنجاح",
      });
      onClose();
    },
    onError: (error) => {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: error?.response?.data?.message || "حدث خطأ أثناء العملية",
      });
    },
  });

  // Handlers
  const handleCustomerSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected_customer = customers?.find(
      (c) => c.id === Number(e.target.value)
    );
    if (selected_customer) {
      setSelectedCustomer(selected_customer);
      setFormData((prev) => ({
        ...prev,
        customerId: selected_customer.id,
        customerName: selected_customer.name,
        customerPhone: selected_customer.phone,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        customerId: undefined,
        customerName: "",
        customerPhone: "",
      }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "totalAmount" || name === "discount" ? Number(value) : value,
    }));
  };

  const handlePaymentTypeChange = (type: PaymentType) => {
    setFormData((prev) => ({
      ...prev,
      paymentType: type,
      paidStatus: type === "cash",
    }));
  };

  const handleItemSelect = (itemId: number) => {
    setSelectedItem(itemId);
    const selectedProduct = items?.find((item) => item.id === itemId);
    if (selectedProduct) {
      setSelectedItemPrice(selectedProduct.price);
      setSelectedItemUnit(selectedProduct.unit);
    }
  };

  const getTitle = () => {
    switch (type) {
      case "products":
        return mode === "income" ? "فاتورة بيع جديدة" : "فاتورة شراء جديدة";
      case "direct":
        return mode === "income" ? "دخل مباشر جديد" : "مصروف مباشر جديد";
      case "debt":
        return mode === "income" ? "تحصيل دين" : "تسجيل دين جديد";
    }
  };

  const addItem = () => {
    const selectedProduct = items?.find((item) => item.id === selectedItem);
    if (!selectedProduct || quantity <= 0) return;

    const newItem: FormItem = {
      id: Date.now(),
      quantity,
      unitPrice: selectedItemPrice,
      unit: selectedItemUnit,
      trayCount: trayCount || undefined,
      subTotal: quantity * selectedItemPrice,
      itemId: selectedProduct.id,
      item: {
        ...selectedProduct,
        price: selectedItemPrice,
        unit: selectedItemUnit,
      },
    };

    setFormItems((prev) => [...prev, newItem]);
    setSelectedItem(0);
    setSelectedItemPrice(0);
    setSelectedItemUnit("");
    setQuantity(1);
    setTrayCount(0);

    // Update total amount
    setFormData((prev) => ({
      ...prev,
      totalAmount: prev.totalAmount + newItem.subTotal,
    }));
  };

  const removeItem = (itemId: number) => {
    const item = formItems.find((i) => i.id === itemId);
    if (!item) return;

    setFormItems((prev) => prev.filter((i) => i.id !== itemId));
    setFormData((prev) => ({
      ...prev,
      totalAmount: prev.totalAmount - item.subTotal,
    }));
  };

  const handleSubmit = async () => {
    try {
      const baseInvoiceData = {
        customerId: formData.customerId,
        notes: formData.notes,
        fundId,
      };

      if (type === "products") {
        // Handle product invoices
        const productInvoiceData = {
          ...baseInvoiceData,
          invoiceType: mode,
          invoiceCategory: "products" as const,
          paidStatus: formData.paymentType === "cash",
          totalAmount: formData.totalAmount,
          items: formItems.map((item) => ({
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            unit: item.unit,
            trayCount: !isPurchaseInvoice ? item.trayCount : undefined,
            itemId: item.itemId,
            subTotal: item.subTotal,
          })),
        };

        if (mode === "income") {
          await createIncomeProducts.mutateAsync({
            ...productInvoiceData,
            discount: formData.discount,
          } as IncomeProductsDTO);
        } else {
          await createExpenseProducts.mutateAsync(
            productInvoiceData as ExpenseProductsDTO
          );
        }
      } else {
        // Handle direct/debt invoices
        const directDebtData: DirectDebtDTO = {
          ...baseInvoiceData,
          invoiceType: mode,
          invoiceCategory: type,
          totalAmount: formData.totalAmount,
          paidStatus: true,
        };

        await createDirectDebt.mutateAsync(directDebtData);
      }

      onClose();
    } catch (error) {
      console.error("Error creating invoice:", error);
    }
  };

  // Loading states for button
  const isSubmitting =
    createIncomeProducts.isPending ||
    createExpenseProducts.isPending ||
    createDirectDebt.isPending;

  const CustomerSection = () => {
    // Filter customers if type is debt
    const filteredCustomers =
      type == "debt" && mode == "income"
        ? customers?.filter((customer) => customer.totalDebt > 0)
        : customers;

    return (
      <div className="space-y-2">
        <label className="block text-slate-200">
          {mode === "income" ? "العميل" : "المورد"}
          {(type == "direct" || type == "debt") && " ( اختياري ) "}
        </label>
        <div className="flex justify-center gap-5 ">
          <div className="relative flex-1">
            <select
              value={formData.customerId || ""}
              onChange={handleCustomerSelect}
              className="w-full appearance-none bg-slate-800/50 text-slate-200 rounded-lg border border-slate-700/50 py-3 px-4 pr-10 focus:outline-none focus:border-slate-600 text-right"
            >
              <option value="" className="bg-slate-800">
                اختر من القائمة
              </option>
              {filteredCustomers?.map((customer) => (
                <option
                  key={customer.id}
                  value={customer.id}
                  className="bg-slate-800 py-2 text-right"
                >
                  {customer.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-4 text-slate-400">
              <svg
                className="h-4 w-4 fill-current"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          {selectedCustomer && selectedCustomer.totalDebt > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-colors disabled:opacity-50 w-fit">
              الدين الذي عليه {selectedCustomer.totalDebt} ليرة
            </div>
          )}
        </div>
      </div>
    );
  };

  // Show simplified form for direct and debt income
  if (type === "direct" || type === "debt") {
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
          className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-100">{getTitle()}</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="space-y-6" dir="rtl">
            {/* Customer Information */}
            <CustomerSection />

            {/* Amount */}
            <div className="space-y-2">
              <label className="block text-slate-200">القيمة</label>
              <div className="relative">
                <Calculator className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                  placeholder="أدخل القيمة"
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="block text-slate-200">ملاحظات</label>
              <div className="relative">
                <FileText className="absolute right-3 top-3 h-5 w-5 text-slate-400" />
                <textarea
                  name="notes"
                  value={formData.notes || ""}
                  onChange={handleChange}
                  className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 resize-none h-24"
                  placeholder="إضافة ملاحظات..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || formData.totalAmount <= 0}
                className="flex-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>جاري الإنشاء...</span>
                  </div>
                ) : (
                  <span>تأكيد</span>
                )}
              </button>
              <button
                onClick={onClose}
                className="flex-1 bg-slate-700/50 text-slate-300 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Product form
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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-100">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6" dir="rtl">
          {/* Customer Information */}
          <CustomerSection />

          {/* Payment Type */}
          <div className="space-y-2">
            <label className="block text-slate-200">طريقة الدفع</label>
            <div className="flex gap-4">
              <button
                onClick={() => handlePaymentTypeChange("cash")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  formData.paymentType === "cash"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <CreditCard className="h-5 w-5" />
                نقدي
              </button>
              <button
                onClick={() => handlePaymentTypeChange("credit")}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  formData.paymentType === "credit"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <Calendar className="h-5 w-5" />
                آجل
              </button>
            </div>
          </div>

          {/* Group Selection */}
          {!isPurchaseInvoice && (
            <div className="space-y-2">
              <label className="block text-slate-200">التصنيف</label>
              <select
                value={selectedGroupId}
                onChange={(e) => {
                  setSelectedGroupId(Number(e.target.value));
                  setSelectedItem(0); // Reset selected item when group changes
                }}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
              >
                <option value={0}>اختر التصنيف</option>
                {itemGroups?.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Item Selection */}

          {(selectedGroupId > 0 || isPurchaseInvoice) && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Product Selection */}
              <div className="space-y-2 md:col-span-2">
                <label className="block text-slate-200">المنتج</label>
                <select
                  value={selectedItem}
                  onChange={(e) => handleItemSelect(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                >
                  <option value={0}>اختر المنتج</option>
                  {items
                    ?.filter(
                      (item) => item.groupId == selectedGroupId
                      // isPurchaseInvoice ? item.type === "raw" : true
                    )
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
              </div>

              {selectedItem > 0 && (
                <>
                  <div className="space-y-2">
                    <label className="block text-slate-200">السعر</label>
                    <input
                      type="number"
                      value={selectedItemPrice}
                      onChange={(e) =>
                        setSelectedItemPrice(Number(e.target.value))
                      }
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-200">الوحدة</label>
                    <input
                      type="text"
                      value={selectedItemUnit}
                      onChange={(e) => setSelectedItemUnit(e.target.value)}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-slate-200">الكمية</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                    />
                  </div>

                  {!isPurchaseInvoice && (
                    <div className="space-y-2">
                      <label className="block text-slate-200">
                        عدد الصواني
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={trayCount}
                        onChange={(e) => setTrayCount(Number(e.target.value))}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Add Item Button */}
          <button
            onClick={addItem}
            disabled={!selectedItem}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
          >
            <Plus className="h-5 w-5" />
            إضافة منتج
          </button>

          {/* Items Table */}
          {formItems.length > 0 && (
            <div className="bg-slate-700/30 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-700/50">
                  <tr>
                    <th className="text-right text-slate-200 p-3">المنتج</th>
                    <th className="text-right text-slate-200 p-3">الكمية</th>
                    <th className="text-right text-slate-200 p-3">السعر</th>
                    <th className="text-right text-slate-200 p-3">الصواني</th>
                    <th className="text-right text-slate-200 p-3">المجموع</th>
                    <th className="text-right text-slate-200 p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {formItems.map((item) => (
                    <tr key={item.id} className="border-t border-slate-600/30">
                      <td className="p-3 text-slate-300">{item.item.name}</td>
                      <td className="p-3 text-slate-300">
                        {item.quantity} {item.item.unit}
                      </td>
                      <td className="p-3 text-slate-300">{item.unitPrice}</td>
                      <td className="p-3 text-slate-300">
                        {item.trayCount || "-"}
                      </td>
                      <td className="p-3 text-slate-300">{item.subTotal}</td>
                      <td className="p-3">
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="border-t border-slate-600/30 bg-slate-700/30">
                    <td colSpan={4} className="p-3 text-slate-200 font-medium">
                      المجموع الكلي
                    </td>
                    <td
                      colSpan={2}
                      className="p-3 text-emerald-400 font-medium"
                    >
                      {formData.totalAmount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Discount Field */}
          {!isPurchaseInvoice && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-slate-200">الخصم</label>
                <div className="relative">
                  <Calculator className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleChange}
                    min="0"
                    className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                    placeholder="قيمة الخصم"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-200">
                  الإجمالي بعد الخصم
                </label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    readOnly
                    value={formData.totalAmount - formData.discount}
                    className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-slate-200">ملاحظات</label>
            <div className="relative">
              <FileText className="absolute right-3 top-3 h-5 w-5 text-slate-400" />
              <textarea
                name="notes"
                value={formData.notes || ""}
                onChange={handleChange}
                className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 resize-none h-24"
                placeholder="إضافة ملاحظات..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSubmit}
              disabled={
                createDirectDebt.isPending ||
                createExpenseProducts.isPending ||
                createIncomeProducts.isPending ||
                formData.totalAmount <= 0
              }
              className="flex-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createDirectDebt.isPending ||
              createExpenseProducts.isPending ||
              createIncomeProducts.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>جاري الإنشاء...</span>
                </div>
              ) : (
                <span>تأكيد</span>
              )}
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-slate-700/50 text-slate-300 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              إلغاء
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InvoiceForm;
