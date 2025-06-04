import { rawMaterialService } from "@/services/warehouse.service";
import { AuditHistoryResponse, RawMaterialApiResponse } from "@/types/warehouse.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useRawMaterialExpenses = () => {
  const query = useQuery<RawMaterialApiResponse, Error>({
    queryKey: ["rawMaterialExpenses"],
    queryFn: () => rawMaterialService.getRawMaterialExpenses(),
  });

  const refetch = () => {
    query.refetch();
  };
  return {
    ...query,
    refetch,
  };
};

// Hook for fetching audit history
export const useAuditHistory = () => {
  return useQuery<AuditHistoryResponse, Error>({
    queryKey: ["auditHistory"],
    queryFn: () => rawMaterialService.getAuditHistory(),
  });
};

// Hook for creating a new audit
export const useCreateAudit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (auditData: { items: Array<{ itemId: number, countedStock: number }> }) =>
      rawMaterialService.createAudit(auditData),
    onSuccess: () => {
      // Invalidate audit history and raw material expenses
      queryClient.invalidateQueries({ queryKey: ["auditHistory"] });
      queryClient.invalidateQueries({ queryKey: ["rawMaterialExpenses"] });
    },
  });
};
