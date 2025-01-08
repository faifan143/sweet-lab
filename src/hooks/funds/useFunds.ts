import { apiClient } from "@/utils/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Fund {
  id: number;
  fundType: "main" | "general" | "booth" | "university";
  currentBalance: number;
  lastUpdate: string; // ISO date string
}

interface TransferToMainDTO {
  amount: number;
}

export const useFunds = () => {
  return useQuery<Fund[]>({
    queryKey: ["funds"],
    queryFn: async () => {
      const response = (await apiClient.get("/funds")) as Fund[];
      return response;
    },
  });
};

export const useTransferToMain = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (data: TransferToMainDTO) => {
      const response = await apiClient.post("/funds/transfer-to-main", data);
      return response;
    },
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["funds"] });
    },
    onError: (error) => {
      console.error("Error transferring funds:", error);
    },
  });
};
