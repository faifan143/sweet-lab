import { CustomerType } from "./customers.type";
import { Invoice } from "./invoice.type";

export interface Advance {
  id: number;
  customerId: number;
  totalAmount: number;
  remainingAmount: number;
  createdAt: string;
  lastPaymentDate: string | null;
  status: "active" | "completed" | "cancelled";
  notes: string | null;
  customer?: CustomerType;
  relatedInvoices?: Invoice[];
}
