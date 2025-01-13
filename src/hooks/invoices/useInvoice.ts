/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/invoices/useInvoice.ts
import { InvoiceService } from "@/services/invoice.service";
import { Invoice } from "@/types/invoice.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface InvoiceTotals {
  income: number;
  expense: number;
  net: number;
}

interface SectionData {
  invoices: Invoice[];
  count: number;
  totals: InvoiceTotals;
}

export interface ShiftData {
  shiftId: number;
  openTime: string;
  booth: SectionData;
  university: SectionData;
  general: SectionData;
}

// Query hook for fetching invoices
export const useInvoices = () => {
  return useQuery<Invoice[], Error>({
    queryKey: ["invoices"],
    queryFn: InvoiceService.fetchInvoices,
  });
};

export const useCurrentInvoices = (isShiftOpen: boolean) => {
  return useQuery<ShiftData | null, Error>({
    queryKey: ["currentInvoices"],
    queryFn: InvoiceService.fetchCurrentInvoices,
    enabled: isShiftOpen,
  });
};

// Mutation hook for income products invoices
export const useCreateIncomeProducts = (options?: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: InvoiceService.createIncomeProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["currentInvoices"] });
      options?.onSuccess();
    },
    onError: options?.onError,
  });
};

// Mutation hook for expense products invoices
export const useCreateExpenseProducts = (options?: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: InvoiceService.createExpenseProducts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["currentInvoices"] });
      options?.onSuccess();
    },
    onError: options?.onError,
  });
};

// Mutation hook for direct/debt invoices
export const useCreateDirectDebt = (options?: {
  onSuccess: () => void;
  onError: (error: any) => void;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: InvoiceService.createDirectDebt,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["currentInvoices"] });
      options?.onSuccess();
    },
    onError: options?.onError,
  });
};

// export const useMarkInvoiceAsPaid = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     mutationFn: ({ id, data }: { id: string | number; data: any }) =>
//       InvoiceService.markInvoiceAsPaid(id, data),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["invoices"] });
//       queryClient.invalidateQueries({ queryKey: ["currentInvoices"] });
//     },
//   });
// };

export const useMarkInvoiceAsPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string | number; data: any }) =>
      InvoiceService.markInvoiceAsPaid(id, data),
    onMutate: async ({ id }) => {
      // Cancel outgoing queries for ["invoices"]
      await queryClient.cancelQueries({ queryKey: ["invoices"] });

      // Snapshot current cache
      const previousInvoices = queryClient.getQueryData<Invoice[]>([
        "invoices",
      ]);

      // Optimistically update the cache
      queryClient.setQueryData<Invoice[]>(["invoices"], (old) =>
        old?.map((invoice) =>
          invoice.id === id ? { ...invoice, status: "paid" } : invoice
        )
      );

      return { previousInvoices };
    },
    onError: (error, variables, context) => {
      // Roll back to the previous cache state
      queryClient.setQueryData(["invoices"], context?.previousInvoices);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["currentInvoices"] });
    },
  });
};
