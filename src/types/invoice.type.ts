// src/types/invoice.ts

export type InvoiceCategory = "products" | "direct" | "debt";

export interface Invoice {
  id: number;
  invoiceNumber: string;
  invoiceType: "expense" | "income";
  invoiceCategory: InvoiceCategory;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  discount: number;
  paidStatus: boolean;
  paymentDate: string | null;
  createdAt: string;
  notes: string;
  fundId: number;
  shiftId: number;
  employeeId: number;
  items: InvoiceItem[];
  employee: Employee;
  fund: Fund;
  shift: Shift;
}

export interface InvoiceItem {
  id: number;
  quantity: number;
  unitPrice: number;
  trayCount: number;
  subTotal: number;
  invoiceId: number;
  itemId: number;
  item: Item;
}

export interface Item {
  id: number;
  name: string;
  type: "raw" | "production";
  unit: string;
  price: number;
  description: string;
  groupId: number;
}

export interface Employee {
  username: string;
}

export interface Fund {
  id: number;
  fundType: "general" | "university" | "booth";
  currentBalance: number;
  lastUpdate: string;
}

export interface Shift {
  id: number;
  shiftType: "morning" | "evening";
  status: "open" | "closed";
  openTime: string;
  closeTime: string;
  employeeId: number;
}

export interface CreateInvoiceItemDTO {
  quantity: number;
  unitPrice: number;
  trayCount?: number;
  itemId: number;
  subTotal: number;
}

export type InvoiceType = "income" | "expense";
export type PaymentType = "cash" | "credit";

// Common fields for all DTOs
interface BaseInvoiceDTO {
  fundId: number;
  notes?: string;
}

// DTO for invoice items
export interface CreateInvoiceItemDTO {
  itemId: number;
  quantity: number;
  unitPrice: number;
  subTotal: number;
  trayCount?: number;
}

// Income Products Invoice DTO
export interface IncomeProductsDTO extends BaseInvoiceDTO {
  invoiceType: "income";
  invoiceCategory: "products";
  customerName: string;
  customerPhone?: string;
  paidStatus: boolean;
  totalAmount: number;
  discount: number;
  items: CreateInvoiceItemDTO[];
}

// Expense Products Invoice DTO
export interface ExpenseProductsDTO extends BaseInvoiceDTO {
  invoiceType: "expense";
  invoiceCategory: "products";
  customerName: string;
  customerPhone?: string;
  paidStatus: boolean;
  totalAmount: number;
  items: CreateInvoiceItemDTO[];
}

// Direct/Debt Invoice DTO (for both income and expense)
export interface DirectDebtDTO extends BaseInvoiceDTO {
  invoiceType: InvoiceType;
  invoiceCategory: "direct" | "debt";
  customerName: string;
  customerPhone?: string;
  totalAmount: number;
  paidStatus: boolean;
}
