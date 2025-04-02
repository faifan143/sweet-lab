import {
  CreateAdvanceDTO,
  CreateAdvanceResponse,
} from "@/hooks/advances/useAdvances";
import { Advance } from "@/types/advances.type";
import { apiClient } from "@/utils/axios";

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

  // Create a new advance
  createAdvance: async (
    advanceData: CreateAdvanceDTO
  ): Promise<CreateAdvanceResponse> => {
    const response = await apiClient.post("/advances", advanceData);
    return response;
  },

  // Repay an advance (placeholder - adjust to your apiClient)
  repayAdvance: async ({
    advanceId,
    amount,
    notes,
  }: {
    advanceId: number;
    amount: number;
    notes?: string;
  }) => {
    const response = await apiClient.post(`/advances/${advanceId}/repay`, {
      amount,
      notes,
    });
    return response;
  },
};
