export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2
  }).format(value);
}

export function formatMonth(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}
