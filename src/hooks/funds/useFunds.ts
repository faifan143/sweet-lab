import { TransferService } from "@/services/transfer.service";
import {
  HandleShiftTransferResponse,
  PendingTransfersResponse,
  TransferHistoryResponse,
} from "@/types/transfer.type";
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
      console.error("Error transfering funds:", error);
    },
  });
};

export const useTransferToNextShift = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: TransferService.generalToNextShift,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["funds"] });
    },
    onError: (error) => {
      console.error("Error transfering funds:", error);
    },
  });
};

export const usePendingTransfers = () => {
  return useQuery<PendingTransfersResponse>({
    queryKey: ["pendingTransfers"],
    queryFn: TransferService.getNextShiftPendingTransfers,
  });
};

export const useTransferHistory = (
  status?: "pending" | "accepted" | "rejected"
) => {
  return useQuery<TransferHistoryResponse>({
    queryKey: ["transferHistory", status],
    queryFn: () => TransferService.getTransferHistory(status),
  });
};
export const useHandlePendingTransfer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    HandleShiftTransferResponse,
    Error,
    {
      id: string;
      data: {
        accept: boolean;
        shiftId: number;
        notes: string;
      };
    }
  >({
    mutationFn: ({ id, data }) =>
      TransferService.handlePendingTransfer(id, data),

    onSuccess: () => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({
        queryKey: ["pendingTransfers"],
      });
      queryClient.invalidateQueries({
        queryKey: ["transferHistory"],
      });
    },

    onError: (error) => {
      console.error("Error handling pending transfer:", error);
    },
  });
};
