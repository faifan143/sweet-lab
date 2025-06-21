// src/utils/formatters.ts
// export const formatDate = (dateString: string | null) => {
//   if (!dateString) return "-";
//   return new Date(dateString).toLocaleDateString("ar-EG", {
//     year: "numeric",
//     month: "numeric",
//     day: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("ar-SY", {
    style: "currency",
    currency: "SYP",
  }).format(amount);
};

export const translateInvoiceType = (type: "expense" | "income") => {
  return type === "expense" ? "صرف" : "دخل";
};

export const formatDate = (dateString: string | Date | null) => {
  if (!dateString) return "-";
  const date = typeof dateString === "string" ? new Date(dateString) : dateString;
  if (isNaN(date.getTime())) return "-";
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  // Convert to Arabic numerals
  const toArabic = (num: number) => num.toString().replace(/[0-9]/g, d => String.fromCharCode(0x0660 + Number(d)));
  return `${toArabic(y)}/${toArabic(m)}/${toArabic(d)}`;
};
