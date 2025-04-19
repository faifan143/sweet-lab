import { apiClient } from "@/utils/axios";
import { Advance } from "@/types/advances.type";
import { Invoice } from "@/types/invoice.type";

// Define types for the new approach
export interface CreateAdvanceInvoiceDTO {
  invoiceType: "income" | "expense";
  invoiceCategory: "advance";
  customerId: number;
  totalAmount: number;
  discount: number;
  paidStatus: boolean;
  fundId: number;
  notes?: string;
}

export interface AdvanceInvoiceResponse extends Invoice {
  customer: {
    id: number;
    name: string;
    phone: string;
    notes: string;
    categoryId: string;
    createdAt: string;
    updatedAt: string;
  };
  employee: {
    username: string;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  trayTracking: any;
  isBreakInvoice: boolean;
}

// Define the services for advances
export const AdvancesServices = {
  // Fetch all active advances
  fetchActiveAdvances: async (): Promise<Advance[]> => {
    const response = await apiClient.get<Advance[]>("/advances/active");
    return response;
  },

  // Fetch advances for a specific customer
  fetchCustomerAdvances: async (customerId: number): Promise<Advance[]> => {
    const response = await apiClient.get<Advance[]>(
      `/advances/customer/${customerId}`
    );
    return response;
  },

  // Fetch a specific advance by ID
  fetchAdvanceById: async (advanceId: number): Promise<Advance> => {
    const response = await apiClient.get<Advance>(`/advances/${advanceId}`);
    return response;
  },

  // Create a new advance through invoice
  createAdvanceInvoice: async (
    advanceData: CreateAdvanceInvoiceDTO
  ): Promise<AdvanceInvoiceResponse> => {
    const response = await apiClient.post<AdvanceInvoiceResponse>(
      "/invoices",
      advanceData
    );
    return response;
  },

  // Create receive advance (income)
  receiveAdvance: async ({
    customerId,
    amount,
    fundId,
    notes,
  }: {
    customerId: number;
    amount: number;
    fundId: number;
    notes?: string;
  }): Promise<AdvanceInvoiceResponse> => {
    return await AdvancesServices.createAdvanceInvoice({
      invoiceType: "income",
      invoiceCategory: "advance",
      customerId,
      totalAmount: amount,
      discount: 0,
      paidStatus: true,
      fundId,
      notes: notes || `سلفة من العميل`,
    });
  },

  // Repay advance (expense)
  repayAdvance: async ({
    customerId,
    amount,
    fundId,
    notes,
  }: {
    customerId: number;
    amount: number;
    fundId: number;
    notes?: string;
  }): Promise<AdvanceInvoiceResponse> => {
    return await AdvancesServices.createAdvanceInvoice({
      invoiceType: "expense",
      invoiceCategory: "advance",
      customerId,
      totalAmount: amount,
      discount: 0,
      paidStatus: true,
      fundId,
      notes: notes || `إرجاع جزء من السلفة للعميل`,
    });
  },
};
