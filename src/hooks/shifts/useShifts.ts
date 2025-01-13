/* eslint-disable @typescript-eslint/no-explicit-any */
// hooks/shifts/useShifts.ts
import { ShiftSummaryData } from "@/components/common/CloseShiftModal";
import { apiClient } from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

interface OpenShiftDTO {
  shiftType: "morning" | "evening";
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
export const useCloseShift = () => {
  return useQuery({
    queryKey: ["closeShift"],
    queryFn: async () => {
      const response = await apiClient.get("/shifts/close");
      return response;
    },
    enabled: false,
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
