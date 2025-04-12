import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AdvancesServices,
  CreateAdvanceInvoiceDTO,
  AdvanceInvoiceResponse,
} from "@/services/advances.service";
import { Advance } from "@/types/advances.type";

// Get all active advances
export const useActiveAdvances = () => {
  return useQuery<Advance[], Error>({
    queryKey: ["activeAdvances"],
    queryFn: AdvancesServices.fetchActiveAdvances,
  });
};

// Get advances for a specific customer
export const useCustomerAdvances = (customerId: number) => {
  return useQuery<Advance[], Error>({
    queryKey: ["customerAdvances", customerId],
    queryFn: () => AdvancesServices.fetchCustomerAdvances(customerId),
    enabled: !!customerId, // Only run the query if customerId is provided
  });
};

// Get a specific advance by ID
export const useAdvanceDetails = (advanceId: number) => {
  return useQuery<Advance, Error>({
    queryKey: ["advanceDetails", advanceId],
    queryFn: () => AdvancesServices.fetchAdvanceById(advanceId),
    enabled: !!advanceId, // Only run the query if advanceId is provided
  });
};

// Interface for receiving an advance
export interface ReceiveAdvanceDTO {
  customerId: number;
  amount: number;
  fundId: number;
  notes?: string;
}

// Interface for repaying an advance
export interface RepayAdvanceDTO {
  customerId: number;
  amount: number;
  fundId: number;
  notes?: string;
}

// Create a new advance (receive advance)
export const useReceiveAdvance = () => {
  const queryClient = useQueryClient();

  return useMutation<AdvanceInvoiceResponse, Error, ReceiveAdvanceDTO>({
    mutationFn: AdvancesServices.receiveAdvance,
    onSuccess: () => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["activeAdvances"] });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "customerAdvances",
      });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["funds"] });
    },
  });
};

// Repay an advance
export const useRepayAdvance = () => {
  const queryClient = useQueryClient();

  return useMutation<AdvanceInvoiceResponse, Error, RepayAdvanceDTO>({
    mutationFn: AdvancesServices.repayAdvance,
    onSuccess: () => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["activeAdvances"] });
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "customerAdvances" ||
          query.queryKey[0] === "advanceDetails",
      });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["funds"] });
    },
  });
};

// Direct creation of advance invoice (for advanced use cases)
export const useCreateAdvanceInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation<AdvanceInvoiceResponse, Error, CreateAdvanceInvoiceDTO>({
    mutationFn: AdvancesServices.createAdvanceInvoice,
    onSuccess: () => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["activeAdvances"] });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "customerAdvances",
      });
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["funds"] });
    },
  });
};
