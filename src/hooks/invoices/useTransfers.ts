/* eslint-disable @typescript-eslint/no-explicit-any */
import { TransferService } from "@/services/transfer.service";
import { TransferRequest } from "@/types/transfer.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTransferAnyToGeneral = (options?: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: TransferService.anyToGeneral,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["currentInvoices"] });
      options?.onSuccess();
    },
    onError: options?.onError,
  });
};

export const useTransferAnyToMain = (options?: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: TransferService.generalToMain,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["currentInvoices"] });
      options?.onSuccess();
    },
    onError: options?.onError,
  });
};

export const useTransferConfirmation = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: {
      transferId: string;
      confirm: boolean;
      rejectionReason?: string;
    }) =>
      TransferService.confirmPendingTransfer(params.transferId, {
        confirm: params.confirm,
        rejectionReason: params.rejectionReason || "",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transfer-history"] });
      queryClient.invalidateQueries({ queryKey: ["transfer-pending"] });
      if (options?.onSuccess) options.onSuccess();
    },
    onError: (error) => {
      if (options?.onError) options.onError(error);
    },
  });
};

export const useMainTransferHistory = (
  status: "pending" | "confirmed" | "rejected"
) => {
  return useQuery<TransferRequest, Error>({
    queryKey: ["transfer-history", status],
    queryFn: () => TransferService.getTransfers(status),
  });
};


