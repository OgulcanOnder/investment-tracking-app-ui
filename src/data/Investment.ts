export interface InvestmentDTO {
  id: number;
  instrumentsId: number;
  instrumentsName: string;
  imageUrl?: string;
  totalQuantity: number;
  currentPrice: number;
  averageCost: number;
  profitLoss: number;
  profitLossPercent: number;
  totalValue: number;
}

export interface LatestInvestmentResponse {
  id: number;
  instrumentsId: number;
  instrumentsName: string;
  quantity: number;
  buyPrice: number;
  buyDate: string;
}
