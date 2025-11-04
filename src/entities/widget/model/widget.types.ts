export type WidgetCardType = "income" | "expenses" | "balance";

export interface WidgetCardData {
  id: string;
  title: string;
  amount: number; // хранится число, чтобы потом форматировать
  changePercent: number; // процент изменения (можно временно рандом)
  cardType: WidgetCardType;
  iconId: string;
}
