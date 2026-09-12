import type { ComponentType } from "react";
import { CreditCardOutlined, BankOutlined, FileTextOutlined, PhoneOutlined, HomeOutlined, DollarOutlined, UserOutlined, ReadOutlined, MedicineBoxOutlined, SyncOutlined, QuestionOutlined } from "@ant-design/icons";
import { DebtType } from "./Debt";

export const DebtTypeIcons: Record<DebtType, ComponentType<{ className?: string }>> = {
  CREDIT_CARD: CreditCardOutlined,
  LOAN: BankOutlined,
  BILL: FileTextOutlined,
  PHONE: PhoneOutlined,
  RENT: HomeOutlined,
  TAX: DollarOutlined,
  PERSONAL_DEBT: UserOutlined,
  EDUCATION: ReadOutlined,
  HEALTH: MedicineBoxOutlined,
  SUBSCRIPTION: SyncOutlined,
  OTHER: QuestionOutlined,
};
