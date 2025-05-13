// services/debts.service.ts
import { Debt, EmployeeDebt } from "@/types/debts.type";
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

  static fetchEmployeeDebtsTracking = async (): Promise<EmployeeDebt[]> => {
    const response = await apiClient.get<EmployeeDebt[]>("/debts?type=employee");
    return response;
  };

  static applyDiscount = async (debtId: number, data: ApplyDiscountRequest): Promise<Debt> => {
    const response = await apiClient.post<Debt>(`/debts/${debtId}/discount`, data);
    return response;
  };
}