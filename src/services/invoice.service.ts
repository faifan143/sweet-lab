// src/services/invoiceService.ts
import { ShiftData } from "@/hooks/invoices/useInvoice";
import {
  DirectDebtDTO,
  ExpenseProductsDTO,
  IncomeProductsDTO,
  Invoice,
} from "@/types/invoice.type";
import { apiClient } from "@/utils/axios";

export class InvoiceService {
  static async fetchInvoices(): Promise<Invoice[]> {
    const response = await apiClient.get<Invoice[]>("/invoices");
    return response;
  }
  static async fetchCurrentInvoices(): Promise<ShiftData> {
    const response = await apiClient.get<ShiftData>("/invoices/current-shift");
    return response;
  }

  static async updateInvoiceStatus(
    invoiceId: number,
    status: "paid" | "debt"
  ): Promise<Invoice> {
    const response = await apiClient.patch<Invoice>(
      `/invoices/${invoiceId}/status`,
      {
        status,
      }
    );
    return response;
  }

  static createIncomeProducts = async (data: IncomeProductsDTO) => {
    const response = await apiClient.post("/invoices", data);
    return response;
  };

  static createExpenseProducts = async (data: ExpenseProductsDTO) => {
    const response = await apiClient.post("/invoices", data);
    return response;
  };

  static createDirectDebt = async (data: DirectDebtDTO) => {
    const response = await apiClient.post("/invoices", data);
    return response;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static markInvoiceAsPaid = async (id: string | number, data: any) => {
    const response = await apiClient.post(`/invoices/${id}/pay`, data);
    return response;
  };
}
