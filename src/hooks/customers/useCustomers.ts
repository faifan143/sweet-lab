import { apiClient } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

export interface CustomerType {
  id: number;
  name: string;
  phone: string;
  totalDebt: number;
}

// export const useOpenShift = (options?: {
//   onSuccess?: () => void;
//   onError?: (error: any) => void;
// }) => {
//   return useMutation({
//     mutationFn: async (data: any) => {
//       const response = await apiClient.post("/shifts", data);
//       return response;
//     },
//     onSuccess: options?.onSuccess,
//     onError: options?.onError,
//   });
// };

export const useCustomersList = () => {
  return useQuery<CustomerType[]>({
    queryKey: ["customers"],
    queryFn: async () => {
      const response = (await apiClient.get(
        "/customers/list"
      )) as CustomerType[];
      return response;
    },
  });
};
