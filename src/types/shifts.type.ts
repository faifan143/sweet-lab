interface Fund {
  id: number;
  fundType: string;
  currentBalance: number;
  lastUpdate: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Employee {
  id: number;
  username: string;
  password: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

interface Invoice {
  id: number;
  invoiceNumber: string;
  invoiceType: string;
  invoiceCategory: string;
  customerId: number | null;
  totalAmount: number;
  discount: number;
  paidStatus: boolean;
  paymentDate: string | null;
  createdAt: string;
  notes: string | null;
  fundId: number;
  shiftId: number;
  employeeId: number;
  relatedDebtId: number | null;
  trayCount: number;
  fund: Fund;
  customer: Customer | null;
  employee: Employee;
}

export interface ShiftsInvoices {
  boothInvoices: Invoice[];
  generalInvoices: Invoice[];
  universityInvoices: Invoice[];
}

export interface CheckPendingTransfersResponse {
  hasPendingTransfers: boolean;
}
