import { IDummyCustomer } from "@/components/customer/CustomerStatsGrid";

export type TAccountType = "Savings Account" | "Current Account" | "Business Account";

export type TAccountStatus = "Active" | "Frozen" | "Inactive" | "Blocked";

export interface IAccount {
  id: string;
  accountNumber: string;
  accountType: TAccountType;
  balance: number;
  status: TAccountStatus;
  currency?: string;
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  isPrimary?: boolean;
  dailyLimit?: number;
  maxSingleTransaction?: number;
  minBalance?: number;
  createdAt?: string;
}

export interface IAccountState {
  accounts: IAccount[];
  selectedAccountId: string | null;
  loading: boolean;
  error: string | null;
}
export interface IRegisterCustomerPayload {
  name: string;
  email: string;
  phone: string;
  password: string;
  pin: string;
}

export interface ICustomersResponse {
  success: boolean;
  message: string;
  data: IDummyCustomer[];
}

export interface IRegisterCustomerResponse {
  success: boolean;
  message: string;
  data: IDummyCustomer;
}
export interface IAccountsListResponse {
  success: boolean;
  message: string;
  data: IAccount[];
}
export interface IUpdateAccountStatusPayload {
  id: string;
  status: "Active" | "Frozen" | "Closed";
  reason?: string;
}

export interface IUpdateAccountLimitsPayload {
  id: string;
  dailyLimit?: number;
  maxSingleTransaction?: number;
  minBalance?: number;
}