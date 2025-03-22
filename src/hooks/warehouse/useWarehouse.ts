import { rawMaterialService } from "@/services/warehouse.service";
import { RawMaterialApiResponse } from "@/types/warehouse.type";
import { useQuery } from "@tanstack/react-query";
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
