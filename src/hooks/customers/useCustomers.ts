import { AllCustomerType, CustomerSummaryData } from "@/types/customers.type";
import { apiClient } from "@/utils/axios";
import { useQuery } from "@tanstack/react-query";

export interface CustomerType {
  id: number;
  name: string;
  phone: string;
  totalDebt: number;
}

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

export const useFetchCustomers = () => {
  return useQuery<AllCustomerType[]>({
    queryKey: ["all-customers"],
    queryFn: async () => {
      const response = (await apiClient.get("/customers")) as AllCustomerType[];
      return response;
    },
  });
};

export const useSummaryCustomer = ({
  customrerId,
}: {
  customrerId: string;
}) => {
  return useQuery<CustomerSummaryData>({
    queryKey: ["customer-summary", customrerId],
    queryFn: async () => {
      const response = (await apiClient.get(
        `/customers/${customrerId}/account-statement`
      )) as CustomerSummaryData;
      return response;
    },
  });
};
