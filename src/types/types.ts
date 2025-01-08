// src/types/index.ts

export enum Role {
  MANAGER = "MANAGER",
  ADMIN = "ADMIN",
  EMPLOYEE = "EMPLOYEE",
}

export enum ShiftType {
  morning = "صباحي",
  evening = "مسائي",
}

export enum ShiftStatus {
  open = "open",
  closed = "closed",
}

export enum FundType {
  main = "main",
  general = "general",
  booth = "booth",
  university = "university",
}

export enum ItemType {
  production = "production",
  raw = "raw",
}

export enum InvoiceType {
  income = "income",
  expense = "expense",
}

export enum InvoiceCategory {
  products = "منتجات",
  direct = "مباشر",
  debt = "دين",
}

export enum PaymentType {
  cash = "cash",
  credit = "credit",
}

export enum DebtStatus {
  active = "active",
  paid = "paid",
}

export interface User {
  id: number;
  username: string;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ItemGroup {
  id: number;
  name: string;
  type: ItemType;
  description?: string;
  items?: Item[];
}

export interface Item {
  id: number;
  name: string;
  type: ItemType;
  unit: string;
  price: number;
  description?: string;
  groupId: number;
  group?: ItemGroup;
  invoiceItems?: InvoiceItem[];
}

export interface Fund {
  id: number;
  fundType: FundType;
  currentBalance: number;
  lastUpdate: Date;
  invoices?: Invoice[];
}

export interface Shift {
  id: number;
  shiftType: ShiftType;
  status: ShiftStatus;
  openTime: Date;
  closeTime: Date | null;
  employeeId: number;
  employee?: User;
  invoices?: Invoice[];
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  invoiceType: InvoiceType;
  customerName?: string;
  customerPhone?: string;
  paymentType: PaymentType;
  totalAmount: number;
  discount: number;
  paidStatus: boolean;
  paymentDate?: Date | null;
  createdAt: Date;
  notes?: string;
  fundId: number;
  fund?: Fund;
  shiftId: number;
  shift?: Shift;
  employeeId: number;
  employee?: User;
  items?: InvoiceItem[];
  debtPayments?: DebtPayment[];
  amount: number;

  date: string;
  type: InvoiceCategory;
  status: InvoiceStatus;
  dueDate?: string;
}

export interface InvoiceItem {
  id: number;
  quantity: number;
  unitPrice: number;
  trayCount: number;
  subTotal: number;
  invoiceId: number;
  invoice?: Invoice;
  itemId: number;
  item?: Item;
}

export interface Debt {
  id: number;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  remainingAmount: number;
  lastPaymentDate?: Date;
  status: DebtStatus;
  notes?: string;
  payments?: DebtPayment[];
}

export interface DebtPayment {
  id: number;
  amount: number;
  paymentDate: Date;
  debtId: number;
  debt?: Debt;
  invoiceId: number;
  invoice?: Invoice;
}

export interface Stats {
  dailySales: number;
  activeCustomers: number;
  totalRevenue: number;
  inventory: number;
  trends: {
    dailySales: number;
    activeCustomers: number;
    revenue: number;
    inventory: number;
  };
}

export type InvoiceStatus = "paid" | "debt";
