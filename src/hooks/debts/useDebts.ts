import { DebtsServices } from "@/services/debts.service";
import { TraysServices } from "@/services/trays.service";
import { Debt } from "@/types/debts.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useDebtsTracking = () => {
  return useQuery<Debt[], Error>({
    queryKey: ["debtsTracking"],
    queryFn: DebtsServices.fetchPDebtsTracking,
  });
};

export const useReturnTrays = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TraysServices.returnTrays,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["debtsTracking"] });
    },
  });
};
