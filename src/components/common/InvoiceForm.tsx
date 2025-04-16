import {
  useActiveAdvances,
  useReceiveAdvance,
  useRepayAdvance,
} from "@/hooks/advances/useAdvances";
import { useCreateCustomer, useCustomersList } from "@/hooks/customers/useCustomers";
import {
  useCreateDirectDebt,
  useCreateExpenseProducts,
  useCreateIncomeProducts,
} from "@/hooks/invoices/useInvoice";
import { useItemGroups } from "@/hooks/items/useItemGroups";
import { useItems } from "@/hooks/items/useItems";
import { Advance } from "@/types/advances.type";
import { CustomerType } from "@/types/customers.type";
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
  AlertTriangle,
  Calculator,
  Calendar,
  CreditCard,
  DollarSign,
  FileText,
  Loader2,
  Plus,
  Trash2,
  User,
  X
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select, { GroupBase, StylesConfig } from 'react-select';
import { useMokkBar } from "../providers/MokkBarContext";

// Define interfaces for select options
interface CustomerOption {
  value: number;
  label: string;
  customer: CustomerType;
}

interface AdvanceOption {
  value: number;
  label: string;
  advance: Advance;
}

type InvoiceType = Invoice["invoiceType"];
type PaymentType = "paid" | "unpaid" | "breakage";

interface InvoiceFormProps {
  type: InvoiceCategory;
  mode: InvoiceType;
  fundId: number;
  onClose: () => void;
  customerId?: number; // Optional prop to pass a predefined customerId
}

interface FormData {
  customerId?: number;
  customerName?: string;
  customerPhone?: string;
  paymentType: PaymentType;
  totalAmount: number;
  firstPayment: number;
  discount: number;
  paidStatus: boolean;
  notes?: string;
  advanceId?: number;
  additionalAmount: number;
}

interface FormItem {
  id: number;
  quantity: number;
  unitPrice: number;
  unit: string;
  factor: number;
  trayCount?: number;
  subTotal: number;
  itemId: number;
  item: Item;
}

// Interface for the customer form
interface CustomerFormData {
  name: string;
  phone: string;
  notes: string;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({
  type,
  mode,
  fundId,
  customerId,
  onClose,
}) => {
  const { setSnackbarConfig } = useMokkBar();
  const { data: customers } = useCustomersList();
  const { data: items } = useItems();
  const { data: itemGroups } = useItemGroups();
  const [trayCount, setTrayCount] = useState<number | undefined>(undefined);

  // Fetch active advances when in repay mode
  const { data: activeAdvances } = useActiveAdvances();

  const [showAddCustomer, setShowAddCustomer] = useState(false);

  // Setup React Hook Form
  const { control, handleSubmit, reset, formState: { errors } } = useForm<CustomerFormData>({
    defaultValues: {
      name: "",
      phone: "",
      notes: ""
    }
  });

  // Customer creation mutation
  const createCustomer = useCreateCustomer();

  const isPurchaseInvoice = mode === "expense";
  const isAdvanceRepay = type === "advance" && mode === "expense";

  // State
  const [formData, setFormData] = useState<FormData>({
    customerId: customerId,
    paymentType: "paid",
    totalAmount: 0,
    firstPayment: 0,
    discount: 0,
    paidStatus: true,
    additionalAmount: 0,
  });

  // Selected advance state
  const [selectedAdvance, setSelectedAdvance] = useState<Advance | null>(null);

  // Find and set the selected customer based on customerId
  useEffect(() => {
    if (customerId && customers) {
      const customer = customers.find((c) => c.id === customerId);
      if (customer) {
        setSelectedCustomer(customer);
        setFormData((prev) => ({
          ...prev,
          customerId: customer.id,
          customerName: customer.name,
          customerPhone: customer.phone,
        }));
      }
    }
  }, [customerId, customers]);

  const [formItems, setFormItems] = useState<FormItem[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number>(0);
  const [selectedItem, setSelectedItem] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerType | null>(
    null
  );
  const [selectedItemPrice, setSelectedItemPrice] = useState<number>(0);
  const [selectedItemUnit, setSelectedItemUnit] = useState<string>("");
  const [selectedItemFactor, setSelectedItemFactor] = useState<number>(1);
  const [selectedUnitIndex, setSelectedUnitIndex] = useState<number>(-1);

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

  // Use advance hooks
  const receiveAdvance = useReceiveAdvance();
  const repayAdvance = useRepayAdvance();

  // Check if the first payment is valid for breakage payment type
  const isFirstPaymentValid =
    formData.paymentType !== "breakage" ||
    (formData.firstPayment > 0 &&
      formData.firstPayment < formData.totalAmount - formData.discount);

  const isSubmitting =
    createDirectDebt.isPending ||
    createExpenseProducts.isPending ||
    createIncomeProducts.isPending ||
    receiveAdvance.isPending ||
    repayAdvance.isPending ||
    formData.totalAmount <= 0 ||
    (type === "products" &&
      mode === "income" &&
      (trayCount === undefined || trayCount < 0)) ||
    !isFirstPaymentValid ||
    (type === "advance" && !formData.customerId);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "totalAmount" || name === "discount" || name === "firstPayment"
          ? Number(value)
          : value,
    }));
  };

  const handlePaymentTypeChange = (type: PaymentType) => {
    setFormData((prev) => ({
      ...prev,
      paymentType: type,
      paidStatus: type === "paid",
      // Reset first payment when payment type changes
      firstPayment: type === "breakage" ? prev.firstPayment : 0,
    }));
  };

  const handleItemSelect = (itemId: number) => {
    setSelectedItem(itemId);
    const selectedProduct = items?.find((item) => item.id === itemId);

    if (selectedProduct) {
      // Initialize with default unit if available
      if (selectedProduct.units && selectedProduct.units.length > 0) {
        // Find default unit in units array
        const defaultUnitIndex = selectedProduct.units.findIndex(
          (u) => u.unit === selectedProduct.defaultUnit
        );

        // Use default unit or first unit if default not found
        const unitIndex = defaultUnitIndex >= 0 ? defaultUnitIndex : 0;
        const unitInfo = selectedProduct.units[unitIndex];

        setSelectedUnitIndex(unitIndex);
        setSelectedItemUnit(unitInfo.unit);
        setSelectedItemPrice(unitInfo.price);
        setSelectedItemFactor(unitInfo.factor);
      } else {
        // Fallback to empty values if no units are defined
        setSelectedUnitIndex(-1);
        setSelectedItemUnit("");
        setSelectedItemPrice(0);
        setSelectedItemFactor(1);
      }
    }
  };

  const handleUnitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const unitIndex = Number(e.target.value);
    setSelectedUnitIndex(unitIndex);

    const selectedProduct = items?.find((item) => item.id === selectedItem);
    if (
      selectedProduct &&
      selectedProduct.units &&
      unitIndex >= 0 &&
      unitIndex < selectedProduct.units.length
    ) {
      const unitInfo = selectedProduct.units[unitIndex];
      setSelectedItemUnit(unitInfo.unit);
      setSelectedItemPrice(unitInfo.price);
      setSelectedItemFactor(unitInfo.factor);
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
      case "advance":
        return mode === "income" ? "استلام سلفة" : "إرجاع سلفة";
      default:
        return "";
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
      factor: selectedItemFactor,
      trayCount: trayCount || undefined,
      subTotal: quantity * selectedItemPrice,
      itemId: selectedProduct.id,
      item: {
        groupId: selectedProduct.groupId!,
        id: selectedProduct.id,
        name: selectedProduct.name,
        type: selectedProduct.type,
        price: selectedItemPrice,
        unit: selectedItemUnit,
        description: selectedProduct.description!,
      },
    };

    setFormItems((prev) => [...prev, newItem]);
    setSelectedItem(0);
    setSelectedItemPrice(0);
    setSelectedItemUnit("");
    setSelectedItemFactor(1);
    setSelectedUnitIndex(-1);
    setQuantity(1);

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

  const handleInvoiceSubmit = async () => {
    if (
      type === "products" &&
      mode === "income" &&
      (trayCount === undefined || trayCount < 0)
    ) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يجب إدخال عدد الفوارغ وأن لا يكون أقل من صفر",
      });
      return;
    }


    // Validate first payment for breakage type
    if (
      formData.paymentType === "breakage" &&
      (formData.firstPayment <= 0 ||
        formData.firstPayment >= formData.totalAmount - formData.discount)
    ) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message:
          "يجب إدخال مبلغ الدفعة الأولى وأن يكون أقل من المبلغ الإجمالي بعد الخصم",
      });
      return;
    }

    // Validate customer selection for advances
    if (type === "advance" && !formData.customerId) {
      setSnackbarConfig({
        open: true,
        severity: "error",
        message: "يجب اختيار عميل للسلفة",
      });
      return;
    }

    try {
      const baseInvoiceData = {
        customerId: formData.customerId,
        notes: formData.notes,
        fundId,
      };

      // Handle advance
      if (type === "advance") {
        const advanceData = {
          customerId: formData.customerId!,
          amount: formData.totalAmount,
          fundId,
          notes: formData.notes,
        };

        if (mode === "income") {
          // Receive advance
          await receiveAdvance.mutateAsync(advanceData);
        } else {
          // Repay advance
          await repayAdvance.mutateAsync(advanceData);
        }
      }
      // Handle product invoices
      else if (type === "products") {
        const productInvoiceData = {
          ...baseInvoiceData,
          invoiceType: mode,
          invoiceCategory: "products" as const,
          paidStatus: formData.paymentType == "paid",
          isBreak: formData.paymentType == "breakage",
          totalAmount: formData.totalAmount,
          trayCount: mode == "income" ? trayCount : 0,
          items: formItems.map((item) => ({
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            itemId: item.itemId,
            unit: item.unit,
          })),
        };

        if (mode === "income") {
          await createIncomeProducts.mutateAsync({
            ...productInvoiceData,
            discount: formData.discount,
            // Add first payment field for breakage payment type
            initialPayment:
              formData.paymentType === "breakage"
                ? formData.firstPayment
                : undefined,
            additionalAmount: formData.additionalAmount, // Add the additional amount
          } as IncomeProductsDTO);
        } else {
          await createExpenseProducts.mutateAsync(
            productInvoiceData as ExpenseProductsDTO
          );
        }
      }
      // Handle direct/debt invoices
      else {
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

  const CustomerSection = () => {
    const isCustomerRequired = type === "advance";
    const isCustomerPreset = isAdvanceRepay && customerId;

    // Format customers for react-select
    const customerOptions: CustomerOption[] = useMemo(() => {
      // Filter customers based on debt or advance repayment requirements
      let filteredCustomers = customers || [];
      if (type === "debt" && mode === "income" && customers) {
        filteredCustomers = customers.filter((customer) => customer.totalDebt > 0);
      }

      return filteredCustomers.map(customer => ({
        value: customer.id,
        label: `${customer.name}${customer.phone ? ` - ${customer.phone}` : ''}`,
        customer
      }));
    }, [customers, type, mode]);

    // Format advances for react-select
    const advanceOptions: AdvanceOption[] = useMemo(() => {
      return (activeAdvances || []).map(advance => ({
        value: advance.id,
        label: `${advance.customer.name} - ${advance.remainingAmount} ليرة`,
        advance
      }));
    }, [activeAdvances]);

    // Handle selection change
    const handleCustomerSelectChange = (selectedOption: CustomerOption | null) => {
      if (selectedOption) {
        const customer = selectedOption.customer;
        setSelectedCustomer(customer);
        setFormData(prev => ({
          ...prev,
          customerId: customer.id,
          customerName: customer.name,
          customerPhone: customer.phone
        }));
      } else {
        setSelectedCustomer(null);
        setFormData(prev => ({
          ...prev,
          customerId: undefined,
          customerName: "",
          customerPhone: ""
        }));
      }
    };

    // Handle advance selection change
    const handleAdvanceSelectChange = (selectedOption: AdvanceOption | null) => {
      if (selectedOption) {
        const advance = selectedOption.advance;
        setSelectedAdvance(advance);
        setSelectedCustomer(advance.customer as unknown as CustomerType);
        setFormData(prev => ({
          ...prev,
          advanceId: advance.id,
          customerId: advance.customerId,
          customerName: advance.customer.name,
          customerPhone: advance.customer.phone,
          totalAmount: advance.remainingAmount
        }));
      } else {
        setSelectedAdvance(null);
        setSelectedCustomer(null);
        setFormData(prev => ({
          ...prev,
          advanceId: undefined,
          customerId: undefined,
          customerName: "",
          customerPhone: "",
          totalAmount: 0
        }));
      }
    };

    // Form submission handler for adding a new customer
    const onSubmitNewCustomer: SubmitHandler<CustomerFormData> = async (data) => {
      try {
        const response = await createCustomer.mutateAsync({
          name: data.name,
          phone: data.phone,
          notes: data.notes || null
        });

        // Set the newly created customer as selected
        setSelectedCustomer(response as unknown as CustomerType);
        setFormData(prev => ({
          ...prev,
          customerId: response.id,
          customerName: response.name,
          customerPhone: response.phone
        }));

        // Reset the form and hide it
        reset();
        setShowAddCustomer(false);

        setSnackbarConfig({
          open: true,
          severity: "success",
          message: "تم إضافة العميل بنجاح"
        });
      } catch (error) {
        setSnackbarConfig({
          open: true,
          severity: "error",
          message: "حدث خطأ أثناء إضافة العميل"
        });
      }
    };

    // Determine current selection for controlled component
    const currentCustomerValue = useMemo(() => {
      if (formData.customerId && customers) {
        const customer = customers.find(c => c.id === formData.customerId);
        if (customer) {
          return {
            value: customer.id,
            label: `${customer.name}${customer.phone ? ` - ${customer.phone}` : ''}`,
            customer
          };
        }
      }
      return null;
    }, [formData.customerId, customers]);

    // Determine current advance selection
    const currentAdvanceValue = useMemo(() => {
      if (formData.advanceId && activeAdvances) {
        const advance = activeAdvances.find(a => a.id === formData.advanceId);
        if (advance) {
          return {
            value: advance.id,
            label: `${advance.customer.name} - ${advance.remainingAmount} ليرة`,
            advance
          };
        }
      }
      return null;
    }, [formData.advanceId, activeAdvances]);

    // Custom styles for react-select - specific to customer options
    const customerSelectStyles: StylesConfig<CustomerOption, false, GroupBase<CustomerOption>> = {
      control: (provided) => ({
        ...provided,
        backgroundColor: 'rgba(51, 65, 85, 0.5)',
        borderColor: isCustomerRequired && !formData.customerId
          ? 'rgba(239, 68, 68, 0.5)'
          : 'rgba(71, 85, 105, 0.5)',
        borderRadius: '0.5rem',
        padding: '0.25rem',
        boxShadow: 'none',
        '&:hover': {
          borderColor: 'rgba(71, 85, 105, 0.8)'
        }
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: 'rgb(30, 41, 59)',
        border: '1px solid rgba(51, 65, 85, 0.5)',
        borderRadius: '0.5rem',
        zIndex: 9999
      }),
      option: (provided, { isSelected, isFocused }) => ({
        ...provided,
        backgroundColor: isSelected
          ? 'rgba(59, 130, 246, 0.5)'
          : isFocused
            ? 'rgba(51, 65, 85, 0.7)'
            : 'transparent',
        color: 'rgb(226, 232, 240)',
        textAlign: 'right',
        '&:hover': {
          backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.5)' : 'rgba(51, 65, 85, 0.7)'
        }
      }),
      singleValue: (provided) => ({
        ...provided,
        color: 'rgb(226, 232, 240)',
        textAlign: 'right'
      }),
      input: (provided) => ({
        ...provided,
        color: 'rgb(226, 232, 240)',
        textAlign: 'right'
      }),
      placeholder: (provided) => ({
        ...provided,
        color: 'rgb(148, 163, 184)',
        textAlign: 'right'
      }),
      indicatorSeparator: () => ({
        display: 'none'
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        color: 'rgb(148, 163, 184)'
      }),
      clearIndicator: (provided) => ({
        ...provided,
        color: 'rgb(148, 163, 184)'
      })
    };

    // Custom styles for react-select - specific to advance options
    const advanceSelectStyles: StylesConfig<AdvanceOption, false, GroupBase<AdvanceOption>> = {
      control: (provided) => ({
        ...provided,
        backgroundColor: 'rgba(51, 65, 85, 0.5)',
        borderColor: isCustomerRequired && !formData.customerId
          ? 'rgba(239, 68, 68, 0.5)'
          : 'rgba(71, 85, 105, 0.5)',
        borderRadius: '0.5rem',
        padding: '0.25rem',
        boxShadow: 'none',
        '&:hover': {
          borderColor: 'rgba(71, 85, 105, 0.8)'
        }
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: 'rgb(30, 41, 59)',
        border: '1px solid rgba(51, 65, 85, 0.5)',
        borderRadius: '0.5rem',
        zIndex: 9999
      }),
      option: (provided, { isSelected, isFocused }) => ({
        ...provided,
        backgroundColor: isSelected
          ? 'rgba(59, 130, 246, 0.5)'
          : isFocused
            ? 'rgba(51, 65, 85, 0.7)'
            : 'transparent',
        color: 'rgb(226, 232, 240)',
        textAlign: 'right',
        '&:hover': {
          backgroundColor: isSelected ? 'rgba(59, 130, 246, 0.5)' : 'rgba(51, 65, 85, 0.7)'
        }
      }),
      singleValue: (provided) => ({
        ...provided,
        color: 'rgb(226, 232, 240)',
        textAlign: 'right'
      }),
      input: (provided) => ({
        ...provided,
        color: 'rgb(226, 232, 240)',
        textAlign: 'right'
      }),
      placeholder: (provided) => ({
        ...provided,
        color: 'rgb(148, 163, 184)',
        textAlign: 'right'
      }),
      indicatorSeparator: () => ({
        display: 'none'
      }),
      dropdownIndicator: (provided) => ({
        ...provided,
        color: 'rgb(148, 163, 184)'
      }),
      clearIndicator: (provided) => ({
        ...provided,
        color: 'rgb(148, 163, 184)'
      })
    };

    return (
      <div className="space-y-4">
        <label className="block text-slate-200">
          {isAdvanceRepay ? "السلفة" : mode === "income" ? "العميل" : "المورد"}
          {isCustomerRequired && <span className="text-red-400 mx-1">*</span>}
          {(type === "direct" || type === "debt") && " ( اختياري ) "}
        </label>

        {isCustomerPreset ? (
          // Display selected customer info when customerId is preset
          <div className="bg-slate-800/50 text-slate-200 rounded-lg border border-slate-700/50 py-3 px-4">
            {selectedCustomer?.name || "العميل المحدد"}
          </div>
        ) : (
          // React-select for customer selection
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                {isAdvanceRepay ? (
                  <Select<AdvanceOption, false, GroupBase<AdvanceOption>>
                    value={currentAdvanceValue}
                    onChange={handleAdvanceSelectChange}
                    options={advanceOptions}
                    styles={advanceSelectStyles}
                    isRtl={true}
                    placeholder="اختر من القائمة"
                    noOptionsMessage={() => "لا توجد خيارات متاحة"}
                    isClearable
                    menuPlacement="auto"
                    classNamePrefix="react-select"
                  />
                ) : (
                  <Select<CustomerOption, false, GroupBase<CustomerOption>>
                    value={currentCustomerValue}
                    onChange={handleCustomerSelectChange}
                    options={customerOptions}
                    styles={customerSelectStyles}
                    isRtl={true}
                    placeholder="اختر من القائمة"
                    noOptionsMessage={() => "لا توجد خيارات متاحة"}
                    isClearable
                    menuPlacement="auto"
                    classNamePrefix="react-select"
                  />
                )}
              </div>
              <button
                onClick={() => {
                  setShowAddCustomer(!showAddCustomer);
                  if (showAddCustomer) {
                    reset();
                  }
                }}
                className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                type="button"
              >
                <Plus className="h-5 w-5" />
                {showAddCustomer ? "إلغاء" : "إضافة عميل"}
              </button>
            </div>

            {/* Add New Customer Form */}
            {showAddCustomer && (
              <form
                onSubmit={handleSubmit(onSubmitNewCustomer)}
                className="p-4 border border-blue-500/20 bg-blue-500/5 rounded-lg space-y-3"
                noValidate
              >
                <h3 className="text-blue-400 text-lg font-medium">إضافة عميل جديد</h3>

                {/* Name Field */}
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-slate-200">الاسم</label>
                  <div className="relative">
                    <User className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Controller
                      name="name"
                      control={control}
                      rules={{ required: "اسم العميل مطلوب" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          id="name"
                          type="text"
                          placeholder="أدخل اسم العميل"
                          className={`w-full pl-4 pr-12 py-2 bg-slate-700/50 border ${errors.name ? "border-red-500/50" : "border-slate-600/50"
                            } rounded-lg text-slate-200`}
                        />
                      )}
                    />
                  </div>

                  {errors.name && (
                    <p className="text-red-400 text-sm">{errors.name.message as string}</p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-slate-200">رقم الهاتف</label>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{ required: "رقم الهاتف مطلوب" }}
                    render={({ field }) => (
                      <input
                        {...field}
                        id="phone"
                        type="text"
                        placeholder="أدخل رقم الهاتف"
                        className={`w-full px-4 py-2 bg-slate-700/50 border ${errors.phone ? "border-red-500/50" : "border-slate-600/50"
                          } rounded-lg text-slate-200`}
                      />
                    )}
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm">{errors.phone.message as string}</p>
                  )}
                </div>

                {/* Notes Field */}
                <div className="space-y-2">
                  <label htmlFor="notes" className="block text-slate-200">ملاحظات (اختياري)</label>
                  <Controller
                    name="notes"
                    control={control}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        id="notes"
                        placeholder="أي ملاحظات إضافية"
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 resize-none h-20"
                      />
                    )}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={createCustomer.isPending}
                  className="bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-lg w-full mt-2 transition-colors disabled:opacity-50"
                >
                  {createCustomer.isPending ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>جاري الإضافة...</span>
                    </div>
                  ) : (
                    <span>إضافة العميل</span>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* Customer information display */}
        {selectedCustomer && (
          <>
            {selectedCustomer.totalDebt > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-colors disabled:opacity-50 w-fit">
                الدين الذي عليه {selectedCustomer.totalDebt} ليرة
              </div>
            )}
            {selectedAdvance && isAdvanceRepay && (
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors disabled:opacity-50 w-fit">
                السلفة النشطة {selectedAdvance.remainingAmount} ليرة
              </div>
            )}
          </>
        )}

        {isCustomerRequired && !formData.customerId && (
          <div className="text-red-400 text-sm mt-1">
            يجب اختيار عميل للسلفة
          </div>
        )}
      </div>
    );
  };


  // Show simplified form for direct, debt, and advance
  if (type === "direct" || type === "debt" || type === "advance") {
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
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-300 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-bold text-slate-100">{getTitle()}</h2>
          </div>

          <div className="space-y-6" dir="rtl">
            {/* Customer Information */}
            {(fundId != 1 || type === "advance") && <CustomerSection />}

            {/* Amount */}
            <div className="space-y-2">
              <label className="block text-slate-200">
                {type === "advance"
                  ? mode === "income"
                    ? "قيمة السلفة"
                    : "قيمة إرجاع السلفة"
                  : "القيمة"}
              </label>
              <div className="relative">
                <Calculator className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                  placeholder={`أدخل ${type === "advance"
                    ? mode === "income"
                      ? "قيمة السلفة"
                      : "قيمة إرجاع السلفة"
                    : "القيمة"
                    }`}
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
                onClick={handleInvoiceSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createDirectDebt.isPending ||
                  createExpenseProducts.isPending ||
                  createIncomeProducts.isPending ||
                  receiveAdvance.isPending ||
                  repayAdvance.isPending ? (
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

  // Product form (rest of the component remains the same)
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
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-bold text-slate-100">{getTitle()}</h2>
        </div>

        <div className="space-y-6" dir="rtl">
          {/* Customer Information */}
          <CustomerSection />

          {/* Payment Type */}
          {mode == "income" && (
            <div className="space-y-2">
              <label className="block text-slate-200">حالة الدفع</label>
              < div className="flex gap-4" >
                <button
                  onClick={() => handlePaymentTypeChange("paid")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${formData.paymentType === "paid"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                    }`
                  }
                >
                  <CreditCard className="h-5 w-5" />
                  دفعة كاملة
                </button>
                < button
                  onClick={() => handlePaymentTypeChange("unpaid")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${formData.paymentType === "unpaid"
                    ? "bg-yellow-500/20 text-yellow-400"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                    }`}
                >
                  <Calendar className="h-5 w-5" />
                  غير مدفوع
                </button>
                < button
                  onClick={() => handlePaymentTypeChange("breakage")}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${formData.paymentType === "breakage"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
                    }`}
                >
                  <AlertTriangle className="h-5 w-5" />
                  كسر
                </button>
              </div>
            </div>
          )}

          {/* Group Selection */}
          {type == "products" && (
            <div className="space-y-4">
              <label className="block text-slate-200 mb-2">التصنيف</label>

              {/* Category Clouds Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {mode == "expense"
                  ? itemGroups
                    ?.filter((itemGroup) => itemGroup.type == "raw")
                    .map((group) => (
                      <div
                        key={group.id}
                        onClick={() => {
                          setSelectedGroupId(group.id);
                          setSelectedItem(0); // Reset selected item when group changes
                        }}
                        className={`
                  rounded-lg shadow-md p-4 text-center cursor-pointer transition-all duration-200
                  border-2 transform hover:scale-105 hover:shadow-lg
                  ${selectedGroupId === group.id
                            ? "bg-blue-500/30 border-blue-500/70 text-blue-200"
                            : "bg-slate-700/30 border-slate-600/30 text-slate-300 hover:bg-slate-700/50"
                          }
                `}
                      >
                        <div className="font-medium text-lg">{group.name}</div>
                      </div>
                    ))
                  : itemGroups
                    ?.filter((itemGroup) => itemGroup.type == "production")
                    .map((group) => (
                      <div
                        key={group.id}
                        onClick={() => {
                          setSelectedGroupId(group.id);
                          setSelectedItem(0); // Reset selected item when group changes
                        }}
                        className={`
                  rounded-lg shadow-md p-4 text-center cursor-pointer transition-all duration-200
                  border-2 transform hover:scale-105 hover:shadow-lg
                  ${selectedGroupId === group.id
                            ? "bg-blue-500/30 border-blue-500/70 text-blue-200"
                            : "bg-slate-700/30 border-slate-600/30 text-slate-300 hover:bg-slate-700/50"
                          }
                `}
                      >
                        <div className="font-medium text-lg">{group.name}</div>
                      </div>
                    ))}
              </div>
            </div>
          )}

          {/* Item Selection */}
          {(selectedGroupId > 0 || isPurchaseInvoice) && (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-slate-200 font-medium">اختيار المنتج</div>
                  {selectedItem > 0 && (
                    <button
                      onClick={() => setSelectedItem(0)}
                      className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                      إلغاء الاختيار
                    </button>
                  )}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {items
                    ?.filter((item) => item.groupId == selectedGroupId)
                    .map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleItemSelect(Number(item.id))}
                        className={`
                rounded-lg shadow-md p-4 cursor-pointer transition-all duration-200
                border-2 transform hover:scale-105 hover:shadow-lg
                ${selectedItem === item.id
                            ? "bg-emerald-500/30 border-emerald-500/70 text-emerald-200"
                            : "bg-slate-700/30 border-slate-600/30 text-slate-300 hover:bg-slate-700/50"
                          }
              `}
                      >
                        <div className="font-medium text-center">{item.name}</div>
                      </div>
                    ))}
                </div>
              </div>

              {selectedItem > 0 && (
                <div className="bg-slate-700/30 rounded-lg p-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {/* Unit Selection */}
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-slate-200">الوحدة</label>
                      <select
                        value={selectedUnitIndex}
                        onChange={handleUnitChange}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                      >
                        {items
                          ?.find((item) => item.id === selectedItem)
                          ?.units?.map((unit, index) => (
                            <option key={index} value={index}>
                              {unit.unit}
                            </option>
                          ))}
                      </select>
                    </div>

                    {/* Factor Input */}
                    <div className="space-y-2">
                      <label className="block text-slate-200">
                        معامل التحويل
                      </label>
                      <input
                        type="number"
                        value={selectedItemFactor}
                        disabled
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
                    <div className="space-y-2">
                      <label className="block text-slate-200">السعر</label>
                      <input
                        type="number"
                        min="1"
                        value={selectedItemPrice}
                        onChange={(e) => setSelectedItemPrice(Number(e.target.value))}
                        className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                      />
                    </div>
                  </div>

                  {/* Add Item Button */}
                  <button
                    onClick={addItem}
                    disabled={!selectedItem || selectedUnitIndex < 0}
                    className="flex items-center gap-2 px-4 py-2 mt-4 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                  >
                    <Plus className="h-5 w-5" />
                    إضافة منتج
                  </button>
                </div>
              )}
            </>
          )}


          {/* Add Item Button */}
          <button
            onClick={addItem}
            disabled={!selectedItem || selectedUnitIndex < 0}
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
                    <th className="text-right text-slate-200 p-3">الوحدة</th>
                    <th className="text-right text-slate-200 p-3">السعر</th>
                    <th className="text-right text-slate-200 p-3">
                      معامل التحويل
                    </th>
                    <th className="text-right text-slate-200 p-3">المجموع</th>
                    <th className="text-right text-slate-200 p-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {formItems.map((item) => (
                    <tr key={item.id} className="border-t border-slate-600/30">
                      <td className="p-3 text-slate-300">{item.item.name}</td>
                      <td className="p-3 text-slate-300">{item.quantity}</td>
                      <td className="p-3 text-slate-300">{item.unit}</td>
                      <td className="p-3 text-slate-300">{item.unitPrice}</td>
                      <td className="p-3 text-slate-300">{item.factor}</td>
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
                </tbody>
              </table>
            </div>
          )}

          {/* Trays Count */}
          {type === "products" && mode === "income" && (
            <div>
              <div className="space-y-2">
                <label className="block text-slate-200">عدد الفوارغ</label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    value={trayCount === undefined ? "" : trayCount}
                    onChange={(e) => {
                      const value = e.target.value === ""
                        ? undefined
                        : Number(e.target.value);
                      setTrayCount(value);
                    }}
                    className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                  />
                  {trayCount === undefined && (
                    <div className="text-red-400 text-sm mt-1">
                      يجب إدخال عدد الفوارغ
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2 mt-4  ">
                <label className="block text-slate-200">
                  المبلغ الإضافي
                </label>
                <div className="relative">
                  <Calculator className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="number"
                    name="additionalAmount"
                    value={formData.additionalAmount}
                    onChange={handleChange}
                    min="0"
                    className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                    placeholder="قيمة المبلغ الإضافي"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  يمكنك إضافة مبلغ إضافي على الفاتورة مثل قيمة التوصيل أو رسوم إضافية
                </p>
              </div>
            </div>
          )}


          {/* First Payment Field (Only show when payment type is "breakage") */}
          {formData.paymentType === "breakage" && (
            <div className="space-y-2">
              <label className="block text-slate-200">الدفعة الأولى</label>
              <div className="relative">
                <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="number"
                  name="firstPayment"
                  value={formData.firstPayment}
                  onChange={handleChange}
                  className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                  placeholder="أدخل قيمة الدفعة الأولى"
                />
              </div>
              {formData.firstPayment <= 0 && (
                <div className="text-red-400 text-sm">
                  يجب إدخال قيمة أكبر من صفر
                </div>
              )}
              {formData.firstPayment >=
                formData.totalAmount - formData.discount &&
                formData.totalAmount > 0 && (
                  <div className="text-red-400 text-sm">
                    يجب أن تكون الدفعة الأولى أقل من المبلغ الإجمالي بعد الخصم
                  </div>
                )}
            </div>
          )}

          {/* Discount and Additional Amount Fields */}
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
                  الإجمالي بعد الخصم والإضافات
                </label>
                <div className="relative">
                  <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    readOnly
                    value={formData.totalAmount - formData.discount + (formData.additionalAmount || 0)}
                    className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Remaining Amount after First Payment (Only for breakage) */}
          {formData.paymentType === "breakage" && (
            <div className="space-y-2">
              <label className="block text-slate-200">
                المبلغ المتبقي بعد الدفعة الأولى
              </label>
              <div className="relative">
                <DollarSign className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  readOnly
                  value={(
                    formData.totalAmount -
                    formData.discount +
                    (formData.additionalAmount || 0) -
                    formData.firstPayment
                  ).toFixed(2)}
                  className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                />
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
              onClick={handleInvoiceSubmit}
              disabled={isSubmitting}
              className="flex-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createDirectDebt.isPending ||
                createExpenseProducts.isPending ||
                createIncomeProducts.isPending ||
                receiveAdvance.isPending ||
                repayAdvance.isPending ? (
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