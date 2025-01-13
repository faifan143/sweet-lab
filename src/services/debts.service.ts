import { Debt } from "@/types/debts.type";
import { apiClient } from "@/utils/axios";

export class DebtsServices {
  static fetchPDebtsTracking = async (): Promise<Debt[]> => {
    const response = await apiClient.get<Debt[]>("/debts");
    return response;
  };
}
