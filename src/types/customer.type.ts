import { IDummyCustomer } from "@/components/customer/CustomerStatsGrid";

export type TCustomerStatus = "Active" | "Inactive" | "Flagged";

export interface ICustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: TCustomerStatus;
  kycVerified: boolean;
  accountsCount: number;
  totalBalance: number;
  joinedAt: string;
}

export interface IRegisterCustomerPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  pin: string;
}
export interface ICustomerState {
  customers: IDummyCustomer[];
  selectedCustomerEmail: string | null;
  loading: boolean;
  error: string | null;
}