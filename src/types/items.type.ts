// src/types/items.type.ts
export type ItemType = "production" | "raw";

export interface BaseItem {
  id: number;
  name: string;
  type: ItemType;
  description: string;
}

export interface Item extends BaseItem {
  unit: string;
  price: number;
  groupId: number;
  group: ItemGroup;
}

export interface ItemGroup extends BaseItem {
  items: Omit<Item, "group">[];
}
