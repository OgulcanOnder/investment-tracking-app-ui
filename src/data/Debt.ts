export enum DebtType {
  CREDIT_CARD = "CREDIT_CARD",
  LOAN = "LOAN",
  BILL = "BILL",
  PHONE = "PHONE",
  RENT = "RENT",
  TAX = "TAX",
  PERSONAL_DEBT = "PERSONAL_DEBT",
  EDUCATION = "EDUCATION",
  HEALTH = "HEALTH",
  SUBSCRIPTION = "SUBSCRIPTION",
  OTHER = "OTHER",
}

export const debtTypeLabels: Record<DebtType, string> = {
  [DebtType.CREDIT_CARD]: "Kredi Kartı",
  [DebtType.LOAN]: "Kredi",
  [DebtType.BILL]: "Fatura",
  [DebtType.PHONE]: "Telefon",
  [DebtType.RENT]: "Kira",
  [DebtType.TAX]: "Vergi",
  [DebtType.PERSONAL_DEBT]: "Kişisel Borç",
  [DebtType.EDUCATION]: "Eğitim",
  [DebtType.HEALTH]: "Sağlık",
  [DebtType.SUBSCRIPTION]: "Abonelik",
  [DebtType.OTHER]: "Diğer",
};

export interface Debt {
  id: number;
  debtType: DebtType;
  description: string;
  amount: number;
}
