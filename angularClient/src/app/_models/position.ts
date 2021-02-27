export interface Position {
  id: number;
  ticker: string;
  shares: number;
  pricePerShare: number;
  commissionFee: number;
  portfolioId: number;
}
