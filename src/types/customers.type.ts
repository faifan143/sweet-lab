// Summary

// Customer Information Interface
interface CustomerInfo {
  id: number;
  name: string;
  phone: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  customerSince: string;
}

// Financial Summary Interface
interface FinancialSummary {
  totalSales: number;
  totalPaid: number;
  currentDebts: number;
  paidDebts: number;
  paymentRatio: number;
  pendingAmount: number;
}

// Trays Information Interface
interface PendingTrayDetail {
  id: number;
  invoiceId: number;
  traysCount: number;
  createdAt: string;
  pendingSince: string;
  notes: string;
}

interface TraysInfo {
  totalPendingTrays: number;
  pendingTraysDetails: PendingTrayDetail[];
}

// Debts Information Interface
interface ActiveDebt {
  id: number;
  totalAmount: number;
  remainingAmount: number;
  createdAt: string;
  lastPaymentDate: string;
  pendingSince: string;
  notes: string;
  paymentProgress: number;
}

interface PaidDebt {
  id: number;
  totalAmount: number;
  paidAmount: number;
  createdAt: string;
  lastPaymentDate: string;
  paidAfter: number;
  notes: string;
}

interface DebtsInfo {
  activeDebts: ActiveDebt[];
  paidDebts: PaidDebt[];
}

// Invoices Information Interface
interface InvoiceItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
  subTotal: number;
}

interface TrayInfo {
  totalTrays: number;
  status: "pending" | "returned";
  returnedAt: string | null;
}

export interface SummaryInvoice {
  id: number;
  invoiceNumber: string;
  totalAmount: number;
  discount: number;
  netAmount: number;
  paidStatus: boolean;
  createdAt: string;
  paymentDate: string | null;
  notes: string | null;
  isBreak: boolean;
  items: InvoiceItem[];
  trayInfo: TrayInfo | null;
}

interface InvoicesInfo {
  totalCount: number;
  incomeInvoices: SummaryInvoice[];
  expenseInvoices: SummaryInvoice[];
}

// Analysis Information Interface
interface PopularItem {
  itemId: number;
  itemName: string;
  totalQuantity: number;
  totalRevenue: number;
  occurrences: number;
}

interface Transaction {
  date: string;
  amount: number;
  invoiceNumber: string;
  daysSinceLastTransaction?: number;
}

interface PaymentBehavior {
  prefersPaying: boolean;
  prefersDebt: boolean;
  paymentReliabilityScore: number;
}

interface AnalysisInfo {
  popularItems: PopularItem[];
  monthlyAverage: number;
  firstTransaction: Transaction;
  lastTransaction: Transaction;
  transactionFrequency: string;
  paymentBehavior: PaymentBehavior;
}

// Main Customer Data Interface
export interface CustomerSummaryData {
  customerInfo: CustomerInfo;
  financialSummary: FinancialSummary;
  traysInfo: TraysInfo;
  debtsInfo: DebtsInfo;
  invoicesInfo: InvoicesInfo;
  analysisInfo: AnalysisInfo;
}

// Fetch All

// Base interfaces for common properties
interface BaseEntity {
  id: number;
  createdAt: string;
}

// Unit interfaces
interface ItemUnit {
  unit: string;
  price: number;
  factor: number;
}

// Item interfaces
interface Item extends BaseEntity {
  name: string;
  type: "production" | "raw"; // Assuming these are the possible types
  units: ItemUnit[];
  defaultUnit: string;
  cost: number;
  price: number;
  description: string;
  groupId: number;
}

// InvoiceItem interface
interface InvoiceItem extends BaseEntity {
  quantity: number;
  unitPrice: number;
  subTotal: number;
  unit: string;
  invoiceId: number;
  itemId: number;
  item: Item;
}

// Invoice interface
interface AllCustomersInvoice extends BaseEntity {
  invoiceNumber: string;
  invoiceType: "income" | "expense";
  invoiceCategory: "products" | "debt" | "direct";
  customerId: number;
  totalAmount: number;
  discount: number;
  paidStatus: boolean;
  paymentDate: string | null;
  notes: string | null;
  isBreak: boolean;
  fundId: number;
  shiftId: number;
  employeeId: number;
  relatedDebtId: number | null;
  trayCount: number;
  items: InvoiceItem[];
}

// Tray interface
interface Tray extends BaseEntity {
  customerId: number;
  totalTrays: number;
  status: "pending" | "returned";
  returnedAt: string | null;
  notes: string;
  invoiceId: number;
}

// Debt interface
interface Debt extends BaseEntity {
  customerId: number;
  totalAmount: number;
  remainingAmount: number;
  lastPaymentDate: string | null;
  status: "active" | "paid";
  notes: string;
}

// Customer interface
export interface AllCustomerType extends BaseEntity {
  name: string;
  phone: string;
  notes: string | null;
  updatedAt: string;
  invoices: AllCustomersInvoice[];
  trays: Tray[];
  debts: Debt[];
}
