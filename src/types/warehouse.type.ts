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
  defaultUnit?: string;
  item?: {
    description?: string;
    units?: Array<{ unit: string; price: number }>;
    defaultUnit?: string;
  };
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

// Audit History Types
export interface AuditItem {
  itemId: number;
  countedStock: number;
  item?: {
    id: number;
    name: string;
    type: string;
    units?: Array<{ unit: string; price: number }>;
    defaultUnit?: string;
  };
}

export interface AuditEntry {
  id: number;
  createdAt: string;
  auditDate?: string;
  employeeId?: number;
  employee?: {
    name: string;
    [key: string]: any;
  };
  notes?: string;
  totalItemsCount?: number;
  totalValueDifference?: number;
  items?: AuditItem[];
  success?: boolean;
  message?: string;
  count?: number;
}

export interface AuditHistoryResponse {
  success: boolean;
  data: AuditEntry[];
  count: number;
  message: string;
}

// New type for inventory items with stock
export interface ItemInventory {
  id: number;
  itemId: number;
  currentStock: number;
  lastUpdated: string;
  item: {
    id: number;
    name: string;
    type: string;
    units: Array<{ unit: string; price: number; factor: number }>;
    defaultUnit: string;
    cost: number;
    price: number;
    productionRate: number;
    description: string;
    groupId: number;
  };
  averageUnitPrice: number;
  totalValue: number;
}



export interface InventoryUnit {
  unit: string;
  price: number;
  factor: number;
}

export interface InventoryItemDetails {
  id: number;
  name: string;
  type: string;
  units: InventoryUnit[];
  defaultUnit: string;
  cost: number;
  price: number;
  productionRate: number;
  description: string;
  groupId: number;
}

export interface InventoryItem {
  id: number;
  itemId: number;
  currentStock: number;
  lastUpdated: string; // ISO date string
  item: InventoryItemDetails;
  averageUnitPrice: number;
  totalValue: number;
}

export interface InventoryItemsResponse {
  success: boolean;
  data: InventoryItem[];
  count: number;
  message: string;
}