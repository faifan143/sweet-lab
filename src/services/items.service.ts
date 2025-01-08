// src/services/items.service.ts
import { apiClient } from "@/utils/axios";
import { Item } from "@/types/items.type";

export class ItemsService {
  static async getItems(): Promise<Item[]> {
    const response = await apiClient.get<Item[]>("/items");
    return response;
  }

  static async getItemById(id: number): Promise<Item> {
    const response = await apiClient.get<Item>(`/items/${id}`);
    return response;
  }

  static async createItem(item: Omit<Item, "id">): Promise<Item> {
    const response = await apiClient.post<Item>("/items", item);
    return response;
  }

  static async updateItem(id: number, item: Partial<Item>): Promise<Item> {
    const response = await apiClient.patch<Item>(`/items/${id}`, item);
    return response;
  }

  static async deleteItem(id: number): Promise<void> {
    await apiClient.delete(`/items/${id}`);
  }
}
