"use client";
import { motion } from "framer-motion";
import {
  AlertCircle,
  Calculator,
  Calendar,
  Clock,
  FileText,
  Mail,
  Phone,
  Plus,
  Trash2,
  User,
  X,
} from "lucide-react";
import React, { useState } from "react";

interface InvoiceFormProps {
  type: "منتجات" | "مباشر" | "دين";
  mode: "income" | "expense";
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (data: any) => void;
}

interface Product {
  id: number;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface CommonFields {
  customerName: string;
  date: string;
  note: string;
}

export interface ProductInvoice extends CommonFields {
  items: Product[];
  total: number;
}

export interface DirectTransaction extends CommonFields {
  amount: number;
  category?: string;
}

export interface DebtTransaction extends CommonFields {
  amount: number;
  phoneNumber: string;
  email: string;
  dueDate: string;
  installments: number;
  paymentTerms: string;
  guarantorName: string;
  guarantorPhone: string;
  debtReason: string;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  type,
  mode,
  onClose,
  onSubmit,
}) => {
  // Common states
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [note, setNote] = useState("");
  const [customerName, setCustomerName] = useState("");

  // Product invoice states
  const [items, setItems] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Direct transaction states
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");

  // Debt transaction states
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [installments, setInstallments] = useState(1);
  const [paymentTerms, setPaymentTerms] = useState("");
  const [guarantorName, setGuarantorName] = useState("");
  const [guarantorPhone, setGuarantorPhone] = useState("");
  const [debtReason, setDebtReason] = useState("");

  const getTitle = () => {
    switch (type) {
      case "منتجات":
        return mode === "income" ? "فاتورة بيع جديدة" : "فاتورة شراء جديدة";
      case "مباشر":
        return mode === "income" ? "دخل مباشر جديد" : "مصروف مباشر جديد";
      case "دين":
        return mode === "income" ? "تحصيل دين" : "تسجيل دين جديد";
    }
  };

  const materials = [
    { id: 1, name: "Material A", price: 50 },
    { id: 2, name: "Material B", price: 100 },
    { id: 3, name: "Material C", price: 150 },
  ];

  const addItem = () => {
    const selectedMaterial = materials.find(
      (material) => material.id === Number(selectedProduct)
    );
    if (selectedMaterial && quantity > 0) {
      setItems([
        ...items,
        {
          id: Date.now(),
          name: selectedMaterial.name,
          quantity,
          price: selectedMaterial.price,
          total: quantity * selectedMaterial.price,
        },
      ]);
      setSelectedProduct("");
      setQuantity(1);
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const total = items.reduce((sum, item) => sum + item.total, 0);
  const renderForm = () => {
    switch (type) {
      case "منتجات":
        return (
          <>
            {/* Product Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-slate-200">المنتج</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="">اختر المنتج</option>
                  {materials.map((material) => (
                    <option key={material.id} value={material.id}>
                      {material.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-200">الكمية</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <button
              onClick={addItem}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
            >
              <Plus className="h-5 w-5" />
              إضافة منتج
            </button>

            {/* Products Table */}
            {items.length > 0 && (
              <div className="bg-slate-700/30 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="text-right text-slate-200 p-3">المنتج</th>
                      <th className="text-right text-slate-200 p-3">الكمية</th>
                      <th className="text-right text-slate-200 p-3">السعر</th>
                      <th className="text-right text-slate-200 p-3">المجموع</th>
                      <th className="text-right text-slate-200 p-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t border-slate-600/30"
                      >
                        <td className="p-3 text-slate-300">{item.name}</td>
                        <td className="p-3 text-slate-300">{item.quantity}</td>
                        <td className="p-3 text-slate-300">${item.price}</td>
                        <td className="p-3 text-slate-300">${item.total}</td>
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
                      <td
                        colSpan={3}
                        className="p-3 text-slate-200 font-semibold"
                      >
                        المجموع الكلي
                      </td>
                      <td className="p-3 text-emerald-400 font-semibold">
                        ${total}
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        );
      case "مباشر":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-slate-200">القيمة</label>
              <div className="relative">
                <Calculator className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            {mode == "expense" && (
              <div className="space-y-2">
                <label className="block text-slate-200">التصنيف</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                >
                  <option value="">اختر التصنيف</option>
                  <option value="رواتب">رواتب</option>
                  <option value="إيجار">إيجار</option>
                  <option value="مرافق">مرافق</option>
                  <option value="أخرى">أخرى</option>
                </select>
              </div>
            )}
          </div>
        );

      case "دين":
        return (
          <>
            {/* Personal Information */}
            <div className="bg-slate-700/30 p-4 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">
                معلومات الشخص
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-slate-200">رقم الهاتف</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                      placeholder="رقم الهاتف"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-200">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                      placeholder="البريد الإلكتروني"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-200">سبب الدين</label>
                  <div className="relative">
                    <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={debtReason}
                      onChange={(e) => setDebtReason(e.target.value)}
                      className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                      placeholder="سبب الدين"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Debt Details */}
            <div className="bg-slate-700/30 p-4 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">
                تفاصيل الدين
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-slate-200">المبلغ</label>
                  <div className="relative">
                    <Calculator className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                      placeholder="المبلغ"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-200">
                    تاريخ الاستحقاق
                  </label>
                  <div className="relative">
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-200">عدد الدفعات</label>
                  <div className="relative">
                    <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="number"
                      min="1"
                      value={installments}
                      onChange={(e) => setInstallments(Number(e.target.value))}
                      className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-200">شروط الدفع</label>
                  <textarea
                    value={paymentTerms}
                    onChange={(e) => setPaymentTerms(e.target.value)}
                    className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                    placeholder="شروط الدفع والاتفاق"
                  />
                </div>
              </div>
            </div>

            {/* Guarantor Information */}
            <div className="bg-slate-700/30 p-4 rounded-lg space-y-4">
              <h3 className="text-lg font-semibold text-slate-200 mb-4">
                معلومات الكفيل
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-slate-200">اسم الكفيل</label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={guarantorName}
                      onChange={(e) => setGuarantorName(e.target.value)}
                      className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                      placeholder="اسم الكفيل"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-slate-200">هاتف الكفيل</label>
                  <div className="relative">
                    <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="tel"
                      value={guarantorPhone}
                      onChange={(e) => setGuarantorPhone(e.target.value)}
                      className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                      placeholder="رقم هاتف الكفيل"
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  // const renderForm = () => {
  //   switch (type) {
  //     case "منتجات":
  //       return (
  //         <>
  //           {/* Product Selection */}
  //           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  //             <div className="space-y-2">
  //               <label className="block text-slate-200">المنتج</label>
  //               <div className="relative">
  //                 <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
  //                 <input
  //                   type="text"
  //                   value={selectedProduct}
  //                   onChange={(e) => setSelectedProduct(e.target.value)}
  //                   placeholder="بحث عن منتج..."
  //                   className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
  //                 />
  //               </div>
  //             </div>

  //             <div className="space-y-2">
  //               <label className="block text-slate-200">الكمية</label>
  //               <input
  //                 type="number"
  //                 min="1"
  //                 value={quantity}
  //                 onChange={(e) => setQuantity(Number(e.target.value))}
  //                 className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
  //               />
  //             </div>

  //             <div className="space-y-2">
  //               <label className="block text-slate-200">السعر</label>
  //               <input
  //                 type="number"
  //                 min="0"
  //                 value={price}
  //                 onChange={(e) => setPrice(Number(e.target.value))}
  //                 className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
  //               />
  //             </div>
  //           </div>

  //           <button
  //             onClick={addItem}
  //             className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors"
  //           >
  //             <Plus className="h-5 w-5" />
  //             إضافة منتج
  //           </button>

  //           {/* Products Table */}
  //           {items.length > 0 && (
  //             <div className="bg-slate-700/30 rounded-lg overflow-hidden">
  //               <table className="w-full">
  //                 <thead className="bg-slate-700/50">
  //                   <tr>
  //                     <th className="text-right text-slate-200 p-3">المنتج</th>
  //                     <th className="text-right text-slate-200 p-3">الكمية</th>
  //                     <th className="text-right text-slate-200 p-3">السعر</th>
  //                     <th className="text-right text-slate-200 p-3">المجموع</th>
  //                     <th className="text-right text-slate-200 p-3"></th>
  //                   </tr>
  //                 </thead>
  //                 <tbody>
  //                   {items.map((item) => (
  //                     <tr
  //                       key={item.id}
  //                       className="border-t border-slate-600/30"
  //                     >
  //                       <td className="p-3 text-slate-300">{item.name}</td>
  //                       <td className="p-3 text-slate-300">{item.quantity}</td>
  //                       <td className="p-3 text-slate-300">${item.price}</td>
  //                       <td className="p-3 text-slate-300">${item.total}</td>
  //                       <td className="p-3">
  //                         <button
  //                           onClick={() => removeItem(item.id)}
  //                           className="text-red-400 hover:text-red-300 transition-colors"
  //                         >
  //                           <Trash2 className="h-5 w-5" />
  //                         </button>
  //                       </td>
  //                     </tr>
  //                   ))}
  //                   <tr className="border-t border-slate-600/30 bg-slate-700/30">
  //                     <td
  //                       colSpan={3}
  //                       className="p-3 text-slate-200 font-semibold"
  //                     >
  //                       المجموع الكلي
  //                     </td>
  //                     <td className="p-3 text-emerald-400 font-semibold">
  //                       ${total}
  //                     </td>
  //                     <td></td>
  //                   </tr>
  //                 </tbody>
  //               </table>
  //             </div>
  //           )}
  //         </>
  //       );

  //     case "مباشر":
  //       return (
  //         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //           <div className="space-y-2">
  //             <label className="block text-slate-200">القيمة</label>
  //             <div className="relative">
  //               <Calculator className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
  //               <input
  //                 type="number"
  //                 value={amount}
  //                 onChange={(e) => setAmount(Number(e.target.value))}
  //                 className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
  //               />
  //             </div>
  //           </div>

  //           {mode == "expense" && (
  //             <div className="space-y-2">
  //               <label className="block text-slate-200">التصنيف</label>
  //               <select
  //                 value={category}
  //                 onChange={(e) => setCategory(e.target.value)}
  //                 className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
  //               >
  //                 <option value="">اختر التصنيف</option>
  //                 <option value="رواتب">رواتب</option>
  //                 <option value="إيجار">إيجار</option>
  //                 <option value="مرافق">مرافق</option>
  //                 <option value="أخرى">أخرى</option>
  //               </select>
  //             </div>
  //           )}
  //         </div>
  //       );

  //     case "دين":
  //       return (
  //         <>
  //           {/* Personal Information */}
  //           <div className="bg-slate-700/30 p-4 rounded-lg space-y-4">
  //             <h3 className="text-lg font-semibold text-slate-200 mb-4">
  //               معلومات الشخص
  //             </h3>
  //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //               <div className="space-y-2">
  //                 <label className="block text-slate-200">رقم الهاتف</label>
  //                 <div className="relative">
  //                   <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
  //                   <input
  //                     type="tel"
  //                     value={phoneNumber}
  //                     onChange={(e) => setPhoneNumber(e.target.value)}
  //                     className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
  //                     placeholder="رقم الهاتف"
  //                   />
  //                 </div>
  //               </div>

  //               <div className="space-y-2">
  //                 <label className="block text-slate-200">
  //                   البريد الإلكتروني
  //                 </label>
  //                 <div className="relative">
  //                   <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
  //                   <input
  //                     type="email"
  //                     value={email}
  //                     onChange={(e) => setEmail(e.target.value)}
  //                     className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
  //                     placeholder="البريد الإلكتروني"
  //                   />
  //                 </div>
  //               </div>

  //               <div className="space-y-2">
  //                 <label className="block text-slate-200">سبب الدين</label>
  //                 <div className="relative">
  //                   <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
  //                   <input
  //                     type="text"
  //                     value={debtReason}
  //                     onChange={(e) => setDebtReason(e.target.value)}
  //                     className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
  //                     placeholder="سبب الدين"
  //                   />
  //                 </div>
  //               </div>
  //             </div>
  //           </div>

  //           {/* Debt Details */}
  //           <div className="bg-slate-700/30 p-4 rounded-lg space-y-4">
  //             <h3 className="text-lg font-semibold text-slate-200 mb-4">
  //               تفاصيل الدين
  //             </h3>
  //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //               <div className="space-y-2">
  //                 <label className="block text-slate-200">المبلغ</label>
  //                 <div className="relative">
  //                   <Calculator className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
  //                   <input
  //                     type="number"
  //                     value={amount}
  //                     onChange={(e) => setAmount(Number(e.target.value))}
  //                     className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
  //                     placeholder="المبلغ"
  //                   />
  //                 </div>
  //               </div>

  //               <div className="space-y-2">
  //                 <label className="block text-slate-200">
  //                   تاريخ الاستحقاق
  //                 </label>
  //                 <div className="relative">
  //                   <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
  //                   <input
  //                     type="date"
  //                     value={dueDate}
  //                     onChange={(e) => setDueDate(e.target.value)}
  //                     className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
  //                   />
  //                 </div>
  //               </div>

  //               <div className="space-y-2">
  //                 <label className="block text-slate-200">عدد الدفعات</label>
  //                 <div className="relative">
  //                   <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
  //                   <input
  //                     type="number"
  //                     min="1"
  //                     value={installments}
  //                     onChange={(e) => setInstallments(Number(e.target.value))}
  //                     className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
  //                   />
  //                 </div>
  //               </div>

  //               <div className="space-y-2">
  //                 <label className="block text-slate-200">شروط الدفع</label>
  //                 <textarea
  //                   value={paymentTerms}
  //                   onChange={(e) => setPaymentTerms(e.target.value)}
  //                   className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
  //                   placeholder="شروط الدفع والاتفاق"
  //                 />
  //               </div>
  //             </div>
  //           </div>

  //           {/* Guarantor Information */}
  //           <div className="bg-slate-700/30 p-4 rounded-lg space-y-4">
  //             <h3 className="text-lg font-semibold text-slate-200 mb-4">
  //               معلومات الكفيل
  //             </h3>
  //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //               <div className="space-y-2">
  //                 <label className="block text-slate-200">اسم الكفيل</label>
  //                 <div className="relative">
  //                   <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
  //                   <input
  //                     type="text"
  //                     value={guarantorName}
  //                     onChange={(e) => setGuarantorName(e.target.value)}
  //                     className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
  //                     placeholder="اسم الكفيل"
  //                   />
  //                 </div>
  //               </div>

  //               <div className="space-y-2">
  //                 <label className="block text-slate-200">هاتف الكفيل</label>
  //                 <div className="relative">
  //                   <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
  //                   <input
  //                     type="tel"
  //                     value={guarantorPhone}
  //                     onChange={(e) => setGuarantorPhone(e.target.value)}
  //                     className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
  //                     placeholder="رقم هاتف الكفيل"
  //                   />
  //                 </div>
  //               </div>
  //             </div>
  //           </div>
  //         </>
  //       );
  //   }
  // };

  const handleSubmit = () => {
    let formData;

    switch (type) {
      case "منتجات":
        formData = {
          type,
          mode,
          date,
          customerName,
          items,
          total,
          note,
        };
        break;

      case "مباشر":
        formData = {
          type,
          mode,
          date,
          customerName,
          amount,
          category,
          note,
        };
        break;

      case "دين":
        formData = {
          type,
          mode,
          date,
          customerName,
          amount,
          phoneNumber,
          email,
          dueDate,
          installments,
          paymentTerms,
          guarantorName,
          guarantorPhone,
          debtReason,
          note,
        };
        break;
    }

    onSubmit(formData);
  };

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
        className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-100">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6" dir="rtl">
          {/* Common Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-slate-200">التاريخ</label>
              <div className="relative">
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-200">
                {mode === "income" ? "اسم الزبون" : "اسم المورد"}
              </label>
              <div className="relative">
                <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          </div>

          {/* Type Specific Form */}
          {renderForm()}

          {/* Notes - Common for all types */}
          <div className="space-y-2">
            <label className="block text-slate-200">ملاحظات</label>
            <div className="relative">
              <FileText className="absolute right-3 top-3 h-5 w-5 text-slate-400" />
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500/50 resize-none h-24"
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSubmit}
              className="flex-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              تأكيد
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="flex-1 bg-slate-700/50 text-slate-300 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors"
            >
              إلغاء
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default InvoiceForm;
