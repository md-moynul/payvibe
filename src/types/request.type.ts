export type TRequestType = "Deposit" | "Withdrawal";
export type TRequestStatus = "Pending" | "Approved" | "Rejected";

export interface IDepositWithdrawalRequest {
  id: string;
  accountId: string;
  accountNumber: string;
  type: TRequestType;
  amount: number;
  description?: string;
  status: TRequestStatus;
  customerId?: string;
  customerEmail?: string;
  customerName?: string;
  rejectionReason?: string;
  createdAt: string;
}

export interface ICreateRequestPayload {
  accountId?: string;
  type: TRequestType;
  amount: number;
  description?: string;
}

export interface IDecideRequestPayload {
  id: string;
  status: "Approved" | "Rejected";
  rejectionReason?: string;
}