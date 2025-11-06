export type WidgetCardType = "income" | "expenses" | "balance";

export interface WidgetCardData {
  id: string;
  title: string;
  amount: number; 
  changePercent: number; 
  cardType: WidgetCardType;
  iconId: string;
}
