import { TrayTracking } from "@/types/items.type";
import { apiClient } from "@/utils/axios";

export class TraysServices {
  static fetchPendingTrayTracking = async (): Promise<TrayTracking[]> => {
    const response = await apiClient.get<TrayTracking[]>(
      "/tray-tracking/pending"
    );
    return response;
  };
  static returnTrays = async (id: number) => {
    const response = await apiClient.post(`/tray-tracking/${id}/return`);
    return response;
  };
}
