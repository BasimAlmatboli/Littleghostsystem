export interface ProfitShare {
  yassirShare: number;
  ahmedShare: number;
  manalShare: number;
  abbasShare: number;
}

export interface ItemProfitDetails {
  total: number;
  revenueProportion: number;
  expenseShare: number;
  cost: number;
  netProfit: number;
  yassirShare: number;
  ahmedShare: number;
  manalShare: number;
  abbasShare: number;
}

export interface TotalProfitShare {
  totalWithShipping: number;
  itemShares: ItemProfitDetails[];
  totalYassirShare: number;
  totalAhmedShare: number;
  totalManalShare: number;
  totalAbbasShare: number;
}