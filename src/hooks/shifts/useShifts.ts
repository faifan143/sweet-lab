// hooks/shifts/useShifts.ts
import { ShiftSummaryData } from "@/components/common/CloseShiftModal";
import { apiClient } from "@/utils/axios";
import { useMutation, useQuery } from "@tanstack/react-query";

interface OpenShiftDTO {
  shiftType: "morning" | "evening";
}

// hooks/shifts/useShifts.ts
export const useOpenShift = (options?: { onSuccess?: () => void }) => {
  return useMutation({
    mutationFn: async (data: OpenShiftDTO) => {
      const response = await apiClient.post("/shifts", data);
      return response;
    },
    onSuccess: options?.onSuccess,
    onError: (error) => {
      console.error("Error opening shift:", error);
    },
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

export interface Shift {
  id: number;
  shiftType: "morning" | "evening";
  status: "open" | "closed";
  openTime: string;
  closeTime: string;
  employeeId: number;
  employee: Employee;
}

export const useShifts = () => {
  return useQuery<Shift[]>({
    queryKey: ["shifts"],
    queryFn: async () => {
      const response = (await apiClient.get("/shifts")) as Shift[];
      return response;
    },
    // enabled: false,
  });
};
