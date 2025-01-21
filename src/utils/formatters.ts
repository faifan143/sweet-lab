// src/utils/formatters.ts
export const formatDate = (dateString: string | null) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ar-SY", {
    style: "currency",
    currency: "SYP",
  }).format(amount);
};

export const translateInvoiceType = (type: "expense" | "income") => {
  return type === "expense" ? "صرف" : "دخل";
};
