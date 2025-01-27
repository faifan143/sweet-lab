/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/shifts/useShifts.ts
import { ShiftSummaryData } from "@/components/common/CloseShiftModal";
import { apiClient } from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

interface OpenShiftDTO {
  shiftType: "morning" | "evening";
}
interface CloseShiftDTO {
  status: "surplus" | "deficit";
  amount: number;
}
// hooks/shifts/useShifts.ts
export const useOpenShift = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async (data: OpenShiftDTO) => {
      const response = await apiClient.post("/shifts", data);
      return response;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};
export const useCloseShift = (options?: {
  onSuccess?: () => void;
  onError?: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async (data: CloseShiftDTO) => {
      const response = await apiClient.get(
        `/shifts/close?differenceStatus=${data.status}&differenceValue=${data.amount}`
      );
      return response;
    },
    onSuccess: options?.onSuccess,
    onError: options?.onError,
  });
};
export const useShiftSummary = () => {
  return useQuery<ShiftSummaryData>({
    queryKey: ["shiftSummary"],
    queryFn: async () => {
      const response = (await apiClient.get(
        "/shifts/current/summary"
      )) as ShiftSummaryData;
      return response;
    },
    enabled: false,
  });
};

export const useFetchShiftSummary = (options?: {
  onSuccess?: (data: ShiftSummaryData) => void;
  onError?: (error: any) => void;
}) => {
  return useMutation({
    mutationFn: async (id: number) => {
      const response = await apiClient.get(`/shifts/${id}/summary`);
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
      const response = (await apiClient.get("/shifts")) as QueryShiftType[];
      return response;
    },
    // enabled: false,
  });
};
