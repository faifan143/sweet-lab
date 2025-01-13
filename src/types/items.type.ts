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

export interface TrayTracking {
  id: number;
  customerId: number;
  totalTrays: number;
  status: "pending" | "returned";
  createdAt: string;
  returnedAt: string | null;
  notes: string;
  invoiceId: number;
  customer: {
    id: 19;
    name: string;
    phone: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
  };
}
