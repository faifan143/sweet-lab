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
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Item> }) =>
      ItemsService.updateItem(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ItemsService.deleteItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });
};
