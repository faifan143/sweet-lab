// services/debts.service.ts
import { Debt } from "@/types/debts.type";
import { apiClient } from "@/utils/axios";

export interface ApplyDiscountRequest {
  discountAmount: number;
  notes: string;
}

export class DebtsServices {
  static fetchPDebtsTracking = async (): Promise<Debt[]> => {
    const response = await apiClient.get<Debt[]>("/debts");
    return response;
  };

  static applyDiscount = async (debtId: number, data: ApplyDiscountRequest): Promise<Debt> => {
    const response = await apiClient.post<Debt>(`/debts/${debtId}/discount`, data);
    return response;
  };
}