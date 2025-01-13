import { TraysServices } from "@/services/trays.service";
import { TrayTracking } from "@/types/items.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePendingTrayTracking = () => {
  return useQuery<TrayTracking[], Error>({
    queryKey: ["pendingTrayTracking"],
    queryFn: TraysServices.fetchPendingTrayTracking,
  });
};

export const useReturnTrays = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TraysServices.returnTrays,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingTrayTracking"] });
    },
  });
};
