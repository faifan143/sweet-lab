// src/hooks/items/useItems.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ItemsService } from "@/services/items.service";
import { Item } from "@/types/items.type";

export const useItems = () => {
  return useQuery<Item[], Error>({
    queryKey: ["items"],
    queryFn: ItemsService.getItems,
  });
};

export const useItem = (id: number) => {
  return useQuery<Item, Error>({
    queryKey: ["items", id],
    queryFn: () => ItemsService.getItemById(id),
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newItem: Omit<Item, "id">) => ItemsService.createItem(newItem),
    onSuccess: () => {
      // Invalidate all items queries
      queryClient.invalidateQueries({ queryKey: ["items"] });
      
      // Invalidate item groups that might display item counts
      queryClient.invalidateQueries({ queryKey: ["itemGroups"] });
      
      // Invalidate invoices as they might contain items
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["currentInvoices"] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Item> }) =>
      ItemsService.updateItem(id, data),
    onSuccess: (_, variables) => {
      // Invalidate the specific item
      queryClient.invalidateQueries({ queryKey: ["items", variables.id] });
      
      // Invalidate all items list
      queryClient.invalidateQueries({ queryKey: ["items"] });
      
      // Invalidate item groups that might display item info
      queryClient.invalidateQueries({ queryKey: ["itemGroups"] });
      
      // Invalidate invoices as they might contain this item
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["currentInvoices"] });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ItemsService.deleteItem,
    onSuccess: (_, deletedItemId) => {
      // Invalidate the specific item
      queryClient.invalidateQueries({ queryKey: ["items", deletedItemId] });
      
      // Invalidate all items list
      queryClient.invalidateQueries({ queryKey: ["items"] });
      
      // Invalidate item groups that might display item counts
      queryClient.invalidateQueries({ queryKey: ["itemGroups"] });
      
      // Invalidate invoices as they might contain this item
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      queryClient.invalidateQueries({ queryKey: ["currentInvoices"] });
    },
  });
};
