import { RawMaterialApiResponse } from "@/types/warehouse.type";
import { apiClient } from "@/utils/axios";

export const rawMaterialService = {
  getRawMaterialExpenses: async (): Promise<RawMaterialApiResponse> => {
    try {
      const response = await apiClient.get<RawMaterialApiResponse>(
        `/invoices/raw-material-expenses`
      );
      return response;
    } catch (error) {
      console.error("Error fetching raw material expenses:", error);
      throw error;
    }
  },
};
