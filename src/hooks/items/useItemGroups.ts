// src/hooks/items/useItemGroups.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ItemGroupsService } from "@/services/item-groups.service";
import { ItemGroup } from "@/types/items.type";

export const useItemGroups = () => {
  return useQuery<ItemGroup[], Error>({
    queryKey: ["itemGroups"],
    queryFn: ItemGroupsService.getItemGroups,
  });
};

export const useItemGroup = (id: number) => {
  return useQuery<ItemGroup, Error>({
    queryKey: ["itemGroups", id],
    queryFn: () => ItemGroupsService.getItemGroupById(id),
  });
};

// export const useCreateItemGroup = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (newGroup: Omit<ItemGroup, "id" | "items">) =>
//       ItemGroupsService.createItemGroup(newGroup),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["itemGroups"] });
//     },
//   });
// };


export const useCreateItemGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newGroup: Omit<ItemGroup, "id" | "items">) =>
      ItemGroupsService.createItemGroup(newGroup),
    onSuccess: (data) => {
      // Optimistically update the cache with the new group
      queryClient.setQueryData(
        ["itemGroups"],
        (oldData: ItemGroup[] | undefined) => {
          return oldData ? [...oldData, data] : [data];
        }
      );
    },
  });
};


export const useUpdateItemGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<ItemGroup> }) =>
      ItemGroupsService.updateItemGroup(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itemGroups"] });
    },
  });
};

export const useDeleteItemGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ItemGroupsService.deleteItemGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itemGroups"] });
    },
  });
};
