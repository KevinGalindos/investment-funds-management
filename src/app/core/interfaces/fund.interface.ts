export interface IFund {
  id: number;
  name: string;
  minimumAmount: number;
  category: FundCategory;
}

export type FundCategory = 'FPV' | 'FIC';
