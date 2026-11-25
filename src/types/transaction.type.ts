// TODO: Replace IDummyTransaction with ITransaction once real transaction API types are finalized
export interface IDummyTransaction {
  id: string;
  type: "Deposit" | "Withdrawal" | "Transfer";
  amount: number;
  status: "Completed" | "Pending" | "Failed";
  date: string;
  reference: string;
  note: string;
}

export type TTransactionType =
  | "Deposit"
  | "Withdrawal"
  | "Transfer"
  | "Fund Transfer"
  | "Loan Disbursement"
  | "Loan Repayment";

export type TTransactionStatus =
  | "Pending"
  | "Completed"
  | "Failed"
  | "Reversed"
  | "Flagged";

export interface ITransaction {
  id: string;
  transactionId: string;
  type: TTransactionType | string;
  amount: number;
  fee?: number;
  status: TTransactionStatus | string;
  senderAccount?: string;
  receiverAccount?: string;
  customerId?: string;
  customerEmail?: string;
  description?: string;
  flagged?: boolean;
  flagReason?: string;
  createdAt: string;
}

export interface ITransactionsQueryParams {
  search?: string;
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface ITransactionsResponse {
  success: boolean;
  message: string;
  data: ITransaction[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ITransferFundsPayload {
  fromAccountId: string;
  recipientAccountNumber: string;
  amount: number;
  pin: string;
  description?: string;
}

export interface ITransferFundsResponse {
  success: boolean;
  message: string;
  data: {
    transactionId: string;
    amount: number;
    senderAccount: string;
    receiverAccount: string;
    newBalance: number;
  };
}

export interface IUpdateTransactionPayload {
  id: string;
  status?: TTransactionStatus;
  flagged?: boolean;
  flagReason?: string;
}