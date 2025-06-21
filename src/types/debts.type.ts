// Type for a related invoice's fund details
interface Fund {
  id: number;
  fundType: string;
  currentBalance: number;
  lastUpdate: string; // ISO date string
}

// Type for a related invoice's employee details
interface Employee {
  username: string;
}

// Type for a related invoice
interface RelatedInvoice {
  id: number;
  invoiceNumber: string;
  invoiceType: "expense" | "income";
  invoiceCategory: "debt" | string;
  customerId: number;
  totalAmount: number;
  discount: number;
  paidStatus: boolean;
  paymentDate: string | null; // ISO date string or null
  createdAt: string; // ISO date string
  notes: string;
  fundId: number;
  shiftId: number;
  employeeId: number;
  relatedDebtId: number;
  employee: Employee;
  fund: Fund;
}

// Type for a customer
interface Customer {
  id: number;
  name: string;
  phone: string;
  notes: string | null;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

// Main type for a debt entry
export interface Debt {
  id: number;
  customerId: number;
  totalAmount: number;
  remainingAmount: number;
  createdAt: string; // ISO date string
  lastPaymentDate: string | null; // ISO date string or null
  status: "active" | "paid" | string;
  notes: string;
  customer: Customer;
  relatedInvoices: RelatedInvoice[];
  discount: number
}

// Employee type for employee debts
interface DebtEmployee {
  id: number;
  username: string;
}

// Related invoice for employee debt (modified for employee context)
interface EmployeeRelatedInvoice {
  id: number;
  invoiceNumber: string;
  invoiceType: "expense" | "income";
  invoiceCategory: string;
  totalAmount: number;
  discount: number;
  paidStatus: boolean;
  paymentDate: string | null;
  createdAt: string;
  notes: string | null;
  fundId: number;
  shiftId: number;
  employeeId: number;
  relatedEmployeeId: number;
  employee: Employee;
  fund: Fund;
}

export interface EmployeeDebt {
  id: number;
  employeeId: number;
  totalAmount: number;
  status: "active" | "paid";
  remainingAmount: number;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  employee: DebtEmployee;
  relatedInvoices: EmployeeRelatedInvoice[];
}