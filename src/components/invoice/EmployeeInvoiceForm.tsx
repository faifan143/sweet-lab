import {
  useAddEmployeeHours,
  useAddEmployeeProduction,
  useCreateEmployeePayment,
  useCreateEmployeeWithdrawal
} from '@/hooks/employees';
import { useCreateDirectDebt } from '@/hooks/invoices/useInvoice';
import {
  EmployeeHoursDTO,
  EmployeePaymentDTO,
  EmployeeProductionDTO,
  EmployeeWithdrawalDTO
} from '@/types/employees.type';
import { EmployeeIncomeOperationType, InvoiceCategory } from '@/types/invoice.type';
import { motion } from 'framer-motion';
import { Calculator, FileText } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useMokkBar } from '../providers/MokkBarContext';

// Import subcomponents
import ActionButtons from './ActionButtons';
import EmployeeSection from './EmployeeSection';

interface EmployeeInvoiceFormProps {
  mode: 'income' | 'expense';
  fundId: number;
  onClose: () => void;
  initialOperationType?: string;
}

const EmployeeInvoiceForm: React.FC<EmployeeInvoiceFormProps> = ({
  mode,
  fundId,
  onClose,
  initialOperationType
}) => {
  const { setSnackbarConfig } = useMokkBar();

  // Default operation type based on mode
  const getDefaultOperationType = () => {
    return mode === 'income' ? 'debtPayment' : 'debt';
  };

  // State
  const [formData, setFormData] = useState({
    employeeId: undefined as number | undefined,
    relatedEmployeeId: undefined as number | undefined,
    employeeName: '',
    totalAmount: 0,
    notes: '',
    operationType: initialOperationType || getDefaultOperationType(),
    // Fields for production
    itemId: undefined as number | undefined,
    quantity: 0,
    productionRate: 0,
    // Fields for hours
    hours: 0,
    hourlyRate: 0
  });

  // Set initial operation type when it changes
  useEffect(() => {
    if (initialOperationType) {
      setFormData(prev => ({
        ...prev,
        operationType: initialOperationType
      }));
    }
  }, [initialOperationType]);

  // Mutation hooks
  const createEmployeePayment = useCreateEmployeePayment({
    onSuccess: () => {
      setSnackbarConfig({
        open: true,
        severity: 'success',
        message: formData.operationType === 'debtPayment'
          ? 'تم تسجيل تسديد الدين بنجاح'
          : 'تم تسجيل إرجاع السحب بنجاح',
      });
      onClose();
    },
    onError: (error) => {
      setSnackbarConfig({
        open: true,
        severity: 'error',
        message: error?.message || 'حدث خطأ أثناء العملية',
      });
    },
  });

  const createEmployeeWithdrawal = useCreateEmployeeWithdrawal({
    onSuccess: () => {
      setSnackbarConfig({
        open: true,
        severity: 'success',
        message: formData.operationType === 'debt'
          ? 'تم تسجيل الدين للموظف بنجاح'
          : 'تم تسجيل السلفة بنجاح',
      });
      onClose();
    },
    onError: (error) => {
      setSnackbarConfig({
        open: true,
        severity: 'error',
        message: error?.message || 'حدث خطأ أثناء العملية',
      });
    },
  });

  // Add direct debt hook for daily salary
  const createDirectDebt = useCreateDirectDebt({
    onSuccess: () => {
      setSnackbarConfig({
        open: true,
        severity: 'success',
        message: 'تم تسجيل الأجر اليومي بنجاح',
      });
      onClose();
    },
    onError: (error) => {
      setSnackbarConfig({
        open: true,
        severity: 'error',
        message: error?.message || 'حدث خطأ أثناء تسجيل الأجر اليومي',
      });
    },
  });

  const addEmployeeProduction = useAddEmployeeProduction({
    onSuccess: () => {
      setSnackbarConfig({
        open: true,
        severity: 'success',
        message: 'تم تسجيل الإنتاج بنجاح',
      });
      onClose();
    },
    onError: (error) => {
      setSnackbarConfig({
        open: true,
        severity: 'error',
        message: error?.message || 'حدث خطأ أثناء العملية',
      });
    },
  });

  const addEmployeeHours = useAddEmployeeHours({
    onSuccess: () => {
      setSnackbarConfig({
        open: true,
        severity: 'success',
        message: 'تم تسجيل الساعات بنجاح',
      });
      onClose();
    },
    onError: (error) => {
      setSnackbarConfig({
        open: true,
        severity: 'error',
        message: error?.message || 'حدث خطأ أثناء العملية',
      });
    },
  });

  // Check if we're submitting
  const isPaymentOrWithdrawal = mode === 'income' ||
    (mode === 'expense' && (formData.operationType === 'debt' || formData.operationType === 'salary_advance'));

  const isProduction = formData.operationType === 'production';
  const isHours = formData.operationType === 'hours';
  const isDailySalary = formData.operationType === 'daily_salary';

  const isSubmitting = !formData.employeeId ||
    (isPaymentOrWithdrawal && formData.totalAmount <= 0) ||
    (isProduction && (!formData.itemId || formData.quantity <= 0 || formData.productionRate <= 0)) ||
    (isHours && (formData.hours <= 0 || formData.hourlyRate <= 0)) ||
    (isDailySalary && formData.totalAmount <= 0);

  const isPending =
    createEmployeePayment.isPending ||
    createEmployeeWithdrawal.isPending ||
    addEmployeeProduction.isPending ||
    addEmployeeHours.isPending ||
    createDirectDebt.isPending;

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['totalAmount', 'quantity', 'hours', 'hourlyRate', 'itemId', 'productionRate'].includes(name)
        ? Number(value)
        : value,
    }));
  };

  // Handle operation type selection
  const handleOperationTypeChange = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      operationType: type,
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!formData.employeeId) {
      setSnackbarConfig({
        open: true,
        severity: 'error',
        message: 'يجب اختيار موظف لإتمام العملية',
      });
      return;
    }

    try {
      if (mode === 'income') {
        // Handle employee payment
        const paymentData: EmployeePaymentDTO = {
          amount: formData.totalAmount,
          paymentType: formData.operationType as EmployeeIncomeOperationType,
          fundId,
          notes: formData.notes,
        };
        await createEmployeePayment.mutateAsync({
          employeeId: formData.employeeId,
          data: paymentData
        });
      } else if (mode === 'expense') {
        if (formData.operationType === 'production') {
          // Handle employee production
          if (!formData.itemId || formData.quantity <= 0 || formData.productionRate <= 0) {
            setSnackbarConfig({
              open: true,
              severity: 'error',
              message: 'يجب اختيار منتج وإدخال كمية ومعدل إنتاج صحيح',
            });
            return;
          }

          const productionData: EmployeeProductionDTO = {
            itemId: formData.itemId,
            quantity: formData.quantity,
            productionRate: formData.productionRate,
            notes: formData.notes,
          };
          await addEmployeeProduction.mutateAsync({
            employeeId: formData.employeeId,
            data: productionData
          });
        } else if (formData.operationType === 'hours') {
          // Handle employee hours
          if (formData.hours <= 0 || formData.hourlyRate <= 0) {
            setSnackbarConfig({
              open: true,
              severity: 'error',
              message: 'يجب إدخال عدد ساعات وأجر ساعة صحيح',
            });
            return;
          }

          const hoursData: EmployeeHoursDTO = {
            hours: formData.hours,
            hourlyRate: formData.hourlyRate,
            notes: formData.notes,
          };
          await addEmployeeHours.mutateAsync({
            employeeId: formData.employeeId,
            data: hoursData
          });
        } else if (formData.operationType === 'daily_salary') {
          // Handle daily employee salary
          if (formData.totalAmount <= 0) {
            setSnackbarConfig({
              open: true,
              severity: 'error',
              message: 'يجب إدخال قيمة أكبر من صفر',
            });
            return;
          }

          // Here we create an invoice directly for daily salary
          const dailySalaryData = {
            invoiceType: 'expense' as const,
            invoiceCategory: InvoiceCategory.EMPLOYEE,
            relatedEmployeeId: formData.employeeId,
            paidStatus: true,
            totalAmount: formData.totalAmount,
            notes: formData.notes || `أجر يومي للموظف - ${new Date().toLocaleDateString()}`,
            fundId,
            employeeInvoiceType: "salary",
          };

          await createDirectDebt.mutateAsync(dailySalaryData);
        } else {
          // Handle employee withdrawal (debt or salary advance)
          if (formData.totalAmount <= 0) {
            setSnackbarConfig({
              open: true,
              severity: 'error',
              message: 'يجب إدخال قيمة أكبر من صفر',
            });
            return;
          }

          const withdrawalData: EmployeeWithdrawalDTO = {
            amount: formData.totalAmount,
            withdrawalType: formData.operationType as 'debt' | 'salary_advance',
            fundId,
            notes: formData.notes,
          };
          await createEmployeeWithdrawal.mutateAsync({
            employeeId: formData.employeeId,
            data: withdrawalData
          });
        }
      }
    } catch (error) {
      console.error('Error handling employee operation:', error);
    }
  };



  // Determine which form fields to show based on operation type
  const renderFormFields = () => {
    if (formData.operationType === 'production') {
      return (
        <>
          {/* Item ID Field */}
          <div className="space-y-2">
            <label className="block text-slate-200">المنتج</label>
            <div className="relative">
              <select
                name="itemId"
                value={formData.itemId || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
              >
                <option value="">اختر المنتج</option>
                {/* You'll need to fetch and map items here */}
                <option value="1">منتج 1</option>
                <option value="2">منتج 2</option>
              </select>
            </div>
          </div>

          {/* Quantity Field */}
          <div className="space-y-2">
            <label className="block text-slate-200">الكمية</label>
            <div className="relative">
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                placeholder="أدخل الكمية"
              />
            </div>
          </div>

          {/* Production Rate Field */}
          <div className="space-y-2">
            <label className="block text-slate-200">معدل الإنتاج</label>
            <div className="relative">
              <input
                type="number"
                name="productionRate"
                value={formData.productionRate}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                placeholder="أدخل معدل الإنتاج"
              />
            </div>
          </div>
        </>
      );
    } else if (formData.operationType === 'hours') {
      return (
        <>
          {/* Hours Field */}
          <div className="space-y-2">
            <label className="block text-slate-200">عدد الساعات</label>
            <div className="relative">
              <input
                type="number"
                name="hours"
                value={formData.hours}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                placeholder="أدخل عدد الساعات"
              />
            </div>
          </div>

          {/* Hourly Rate Field */}
          <div className="space-y-2">
            <label className="block text-slate-200">أجر الساعة</label>
            <div className="relative">
              <input
                type="number"
                name="hourlyRate"
                value={formData.hourlyRate}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
                placeholder="أدخل أجر الساعة"
              />
            </div>
          </div>
        </>
      );
    } else {
      // For payments, withdrawals, and daily salary
      return (
        <div className="space-y-2">
          <label className="block text-slate-200">المبلغ</label>
          <div className="relative">
            <Calculator className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="number"
              name="totalAmount"
              value={formData.totalAmount}
              onChange={handleChange}
              className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200"
              placeholder="أدخل المبلغ"
            />
          </div>
        </div>
      );
    }
  };

  // Generate operation type title based on current operation type
  const getOperationTypeTitle = () => {
    if (mode === 'income') {
      return formData.operationType === 'debtPayment'
        ? 'تسديد دين موظف'
        : 'إرجاع سحب موظف';
    } else {
      switch (formData.operationType) {
        case 'debt': return 'دين للموظف';
        case 'salary_advance': return 'سلفة على الراتب';
        case 'production': return 'إضافة إنتاج';
        case 'hours': return 'إضافة ساعات';
        case 'daily_salary': return 'أجر يومي للموظف';
        default: return 'عملية موظف';
      }
    }
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
        className="bg-slate-800 p-6 rounded-lg shadow-xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-300 transition-colors"
          >
            <FileText className="h-6 w-6" />
          </button>
          <h2 className="text-xl font-bold text-slate-100">
            {getOperationTypeTitle()}
          </h2>
        </div>

        <div className="space-y-6" dir="rtl">
          {/* Employee Selector */}
          <EmployeeSection
            formData={formData}
            setFormData={setFormData}
            type={InvoiceCategory.EMPLOYEE}
            mode={mode}
          />



          {/* Dynamic Form Fields Based on Operation Type */}
          {renderFormFields()}

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-slate-200">ملاحظات</label>
            <div className="relative">
              <FileText className="absolute right-3 top-3 h-5 w-5 text-slate-400" />
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full pl-4 pr-12 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-200 resize-none h-24"
                placeholder="إضافة ملاحظات..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <ActionButtons
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onCancel={onClose}
            isPending={isPending}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default EmployeeInvoiceForm;