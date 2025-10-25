export const TYPE_COLORS = {
  Income: "#02B15A",
  Expenses: "#F50909",
} as const;

export type TypeColorKey = keyof typeof TYPE_COLORS;