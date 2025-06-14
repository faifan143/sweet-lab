import { AuditHistoryResponse, RawMaterialApiResponse } from "@/types/warehouse.type";
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

  // Get audit history for inventory items
  getAuditHistory: async (): Promise<AuditHistoryResponse> => {
    try {
      const response = await apiClient.get<AuditHistoryResponse>(`/invoices/inventory/audit-history`);
      return response;
    } catch (error) {
      console.error("Error fetching audit history:", error);
      throw error;
    }
  },

  // Create a new audit entry
  createAudit: async (auditData: { items: Array<{ itemId: number, countedStock: number }> }): Promise<any> => {
    try {
      const response = await apiClient.post(`/invoices/inventory/audit`, auditData);
      return response;
    } catch (error) {
      console.error("Error creating audit:", error);
      throw error;
    }
  },

  getInventoryItems: async () => {
    const response = await apiClient.get("/invoices/inventory/items");
    return response;
  }
};
