export interface Position {
  id: number;
  ticker: string;
  shares: number;
  pricePerShare: number;
  commissionFee: number;
  costBasis: number;
  portfolioId: number;
}

export interface CreatePosition {
  ticker: string;
  shares: number;
  pricePerShare: number;
  commissionFee: number;
  portfolioId: number;
}
