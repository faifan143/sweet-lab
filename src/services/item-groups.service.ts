import { ItemGroup } from "@/types/items.type";
import { apiClient } from "@/utils/axios";

// src/services/item-groups.service.ts
export class ItemGroupsService {
  static async getItemGroups(): Promise<ItemGroup[]> {
    const response = await apiClient.get<ItemGroup[]>("/item-groups");
    return response;
  }

  static async getItemGroupById(id: number): Promise<ItemGroup> {
    const response = await apiClient.get<ItemGroup>(`/item-groups/${id}`);
    return response;
  }

  static async createItemGroup(
    group: Omit<ItemGroup, "id" | "items">
  ): Promise<ItemGroup> {
    const response = await apiClient.post<ItemGroup>("/item-groups", group);
    return response;
  }

  static async updateItemGroup(
    id: number,
    group: Partial<ItemGroup>
  ): Promise<ItemGroup> {
    const response = await apiClient.patch<ItemGroup>(
      `/item-groups/${id}`,
      group
    );
    return response;
  }

  static async deleteItemGroup(id: number): Promise<void> {
    await apiClient.delete(`/item-groups/${id}`);
  }
}
