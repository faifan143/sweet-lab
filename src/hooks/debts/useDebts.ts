// hooks/debts/useDebts.ts
import { DebtsServices, ApplyDiscountRequest } from "@/services/debts.service";
import { TraysServices } from "@/services/trays.service";
import { Debt, EmployeeDebt } from "@/types/debts.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDebtsTracking = () => {
  return useQuery<Debt[], Error>({
    queryKey: ["debtsTracking"],
    queryFn: DebtsServices.fetchPDebtsTracking,
  });
};

export const useEmployeesDebtsTracking = () => {
  return useQuery<EmployeeDebt[], Error>({
    queryKey: ["emplDebtsTracking"],
    queryFn: DebtsServices.fetchEmployeeDebtsTracking,
  });
};

export const useReturnTrays = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: TraysServices.returnTrays,
    onSuccess: () => {
      // Invalidate debt tracking queries
      queryClient.invalidateQueries({ queryKey: ["debtsTracking"] });
      queryClient.invalidateQueries({ queryKey: ["emplDebtsTracking"] });
      
      // Invalidate invoice queries as trays may be related to invoices
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["currentInvoices"] });
      
      // Invalidate customer summaries as they might include debt info
      queryClient.invalidateQueries({ queryKey: ["customer-summary"] });
      
      // Invalidate funds as tray returns might affect balances
      queryClient.invalidateQueries({ queryKey: ["funds"] });
    },
  });
};

export const useApplyDiscount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ debtId, data }: { debtId: number, data: ApplyDiscountRequest }) =>
      DebtsServices.applyDiscount(debtId, data),
    onSuccess: () => {
      // Invalidate debt tracking queries
      queryClient.invalidateQueries({ queryKey: ["debtsTracking"] });
      queryClient.invalidateQueries({ queryKey: ["emplDebtsTracking"] });
      
      // Invalidate invoice queries as discounts affect invoice amounts
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["currentInvoices"] });
      
      // Invalidate customer summaries as they might include debt info
      queryClient.invalidateQueries({ queryKey: ["customer-summary"] });
      
      // Invalidate funds as discounts might affect balances
      queryClient.invalidateQueries({ queryKey: ["funds"] });
      
      // Invalidate shift summaries as they track financial totals
      queryClient.invalidateQueries({ queryKey: ["shiftSummary"] });
      queryClient.invalidateQueries({ queryKey: ["shiftInvoices"] });
    },
  });
};
