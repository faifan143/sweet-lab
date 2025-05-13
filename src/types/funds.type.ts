// Fund type placeholder for workshop settlements
export interface Fund {
  id: number;
  fundType: 'main' | 'general' | 'booth' | 'university';
  currentBalance: number;
  lastUpdate: string;
  createdAt: string;
  updatedAt: string;
}
