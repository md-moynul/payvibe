import type { IDummyCustomer } from "@/components/customer/CustomerStatsGrid";

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

export interface ICustomersResponse {
  success: boolean;
  message: string;
  data: ICustomer[];
}

export interface IRegisterCustomerResponse {
  success: boolean;
  message: string;
  data: ICustomer;
}

export interface IApproveKycPayload {
  id: string;
  kycVerified?: boolean;
}

export interface IApproveKycResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    kycVerified: boolean;
  };
}

export interface IUpdateCustomerStatusPayload {
  id: string;
  status: TCustomerStatus;
}

export interface IUpdateCustomerStatusResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: TCustomerStatus;
  };
}