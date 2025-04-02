import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdvancesServices } from "@/services/advances.service";
import { Advance } from "@/types/advances.type";

// Type for creating an advance
export interface CreateAdvanceDTO {
  amount: number;
  customerId: number;
  fundId: number;
  notes?: string;
}

// Type for response from create advance
export interface CreateAdvanceResponse {
  success: boolean;
  message: string;
  advanceRecord: Advance;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  invoice: any; // You can define a more specific type if needed
}

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

// Create a new advance
export const useCreateAdvance = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateAdvanceResponse, Error, CreateAdvanceDTO>({
    mutationFn: AdvancesServices.createAdvance,
    onSuccess: () => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["activeAdvances"] });
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "customerAdvances",
      });
    },
  });
};

// You might want to add a mutation for repaying an advance
// This is just a placeholder - adjust according to your API
export const useRepayAdvance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdvancesServices.repayAdvance,
    onSuccess: () => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["activeAdvances"] });
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "customerAdvances" ||
          query.queryKey[0] === "advanceDetails",
      });
    },
  });
};
