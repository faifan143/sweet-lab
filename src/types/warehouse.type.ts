// Types for Raw Material Expenses

interface Unit {
  unit: string;
  price: number;
  factor: number;
}

interface Item {
  id: number;
  name: string;
  type: string;
  units: Unit[];
  defaultUnit: string;
  cost: number;
  price: number;
  description: string;
  groupId: number;
}

interface InvoiceItem {
  id: number;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  unit: string;
  invoiceId: number;
  itemId: number;
  item: Item;
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
  username: string;
}

interface Fund {
  id: number;
  fundType: string;
  currentBalance: number;
  lastUpdate: string;
}

export interface WareHouseInvoice {
  id: number;
  invoiceNumber: string;
  invoiceType: string;
  invoiceCategory: string;
  customerId: number;
  totalAmount: number;
  discount: number;
  paidStatus: boolean;
  paymentDate: string;
  createdAt: string;
  notes: string | null;
  isBreak: boolean;
  fundId: number;
  shiftId: number;
  employeeId: number;
  relatedDebtId: null | number;
  trayCount: number;
  items: InvoiceItem[];
  employee: Employee;
  fund: Fund;
  customer: Customer;
}

interface RawMaterialTransaction {
  invoiceId: number;
  invoiceNumber: string;
  date: string;
  quantity: number;
  unitPrice: number;
  total: number;
  paidStatus: boolean;
}

interface RawMaterialItemStat {
  itemId: number;
  itemName: string;
  totalQuantity: number;
  totalCost: number;
  averageUnitPrice: number;
  invoiceCount: number;
  transactions: RawMaterialTransaction[];
}

interface RawMaterialStatSummary {
  totalUniqueItems: number;
  totalQuantity: number;
  totalCost: number;
  itemsByTotalCost: Array<{
    itemName: string;
    totalCost: number;
    percentage: number;
  }>;
  itemsByQuantity: Array<{
    itemName: string;
    totalQuantity: number;
  }>;
}

export interface RawMaterialApiResponse {
  invoices: WareHouseInvoice[];
  totalCount: number;
  totalAmount: number;
  paidAmount: number;
  unpaidAmount: number;
  rawMaterialStats: {
    items: RawMaterialItemStat[];
    summary: RawMaterialStatSummary;
  };
}
