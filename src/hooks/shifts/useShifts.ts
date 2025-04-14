/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/shifts/useShifts.ts
import { ShiftSummaryData } from "@/components/common/CloseShiftModal";
import { TransferService } from "@/services/transfer.service";
import {
  CheckPendingTransfersResponse,
  ShiftsInvoices,
} from "@/types/shifts.type";
import { apiClient } from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

interface OpenShiftDTO {
  shiftType: "morning" | "evening";
}
// Define response type based on Postman response
interface CloseShiftResponse {
  message: string;
  shift: {
    id: number;
    shiftType: "morning" | "evening";
    status: "closed";
    openTime: string;
    closeTime: string;
    differenceStatus: "surplus" | "deficit" | null;
    differenceValue: number;
    employeeId: number;
    employee: {
      id: number;
      username: string;
    };
  };
  expectedAmount: number;
  actualAmount: number;
  differenceStatus: "surplus" | "deficit" | null;
  differenceValue: number;
  transfers: {
    boothTransfer: number;
    universityTransfer: number;
    totalTransferred: number;
  };
}
// Input DTO for closing shift
export interface CloseShiftDTO {
  amount: number;
}

// hooks/shifts/useShifts.ts
export const useOpenShift = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async (data: OpenShiftDTO) => {
      const response = await apiClient.post("shifts", data);
      return response;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

export const useCloseShift = (options?: {
  onSuccess?: (data: CloseShiftResponse) => void;
  onError?: (error: any) => void;
}) => {
  return useMutation<CloseShiftResponse, any, CloseShiftDTO>({
    mutationFn: async (data: CloseShiftDTO) => {
      // Changed to POST request with only actualAmount in the body
      const response = await apiClient.post<CloseShiftResponse>("shifts/close", {
        actualAmount: data.amount
      });
      return response;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

export const useCheckPendingTransfers = () => {
  return useQuery<CheckPendingTransfersResponse>({
    queryKey: ["checkingPendingTransfers"],
    queryFn: TransferService.checkPendingTransfers,
  });
};

export const useShiftSummary = () => {
  return useQuery<ShiftSummaryData>({
    queryKey: ["shiftSummary"],
    queryFn: async () => {
      const response = (await apiClient.get(
        "shifts/current/summary"
      )) as ShiftSummaryData;
      return response;
    },
    enabled: false,
  });
};

export const useShiftInvoices = (id: string, options?: { enabled?: boolean }) => {
  return useQuery<ShiftsInvoices>({
    queryKey: ["shiftInvoices", id],
    queryFn: async () => {
      const response = (await apiClient.get(
        `shifts/${id}/invoices-by-fund`
      )) as ShiftsInvoices;
      return response;
    },
    enabled: !!id && (options?.enabled !== false),
  });
};

export const useFetchShiftSummary = (options?: {
  onSuccess?: (data: ShiftSummaryData) => void;
  onError?: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.get(`shifts/${id}/summary`);
      return response as ShiftSummaryData;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};

export interface Employee {
  id: number;
  username: string;
}

export interface QueryShiftType {
  id: number;
  shiftType: "morning" | "evening";
  status: "open" | "closed";
  openTime: string;
  closeTime: string;
  employeeId: number;
  employee: Employee;
  differenceStatus: "surplus" | "deficit" | null;
  differenceValue: number | null;
}

export const useShifts = () => {
  return useQuery<QueryShiftType[]>({
    queryKey: ["shifts"],
    queryFn: async () => {
      const response = (await apiClient.get("shifts")) as QueryShiftType[];
      return response;
    },
    // enabled: false,
  });
};
