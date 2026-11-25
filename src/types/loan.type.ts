export type TLoanStatus =
  | "Pending"
  | "Under Review"
  | "Approved"
  | "Rejected"
  | "Active"
  | "Completed";

export interface ILoan {
  id: string;
  loanType: string;
  requestedAmount: number;
  durationMonths: number;
  monthlyIncome?: number;
  employmentStatus?: string;
  description?: string;
  interestRate?: number;
  totalPayable?: number;
  monthlyInstallment?: number;
  status: TLoanStatus;
  customerId?: string;
  customerName?: string;
  customerEmail?: string;
  staffNotes?: string;
  remainingBalance?: number;
  createdAt?: string;
}

export interface IApplyLoanPayload {
  loanType: string;
  requestedAmount: number;
  durationMonths: number;
  monthlyIncome: number;
  employmentStatus: string;
  description?: string;
}

export interface ILoansResponse {
  success: boolean;
  message: string;
  data: ILoan[];
}

export interface IApplyLoanResponse {
  success: boolean;
  message: string;
  data: ILoan;
}
export interface IReviewLoanPayload {
  id: string;
  staffNotes: string;
  status?: "Under Review" | "Pending";
}

export interface IReviewLoanResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: TLoanStatus;
    staffNotes: string;
  };
}
export type TLoanDecisionStatus = "Approved" | "Rejected";

export interface IDecideLoanPayload {
  id: string;
  status: TLoanDecisionStatus;
  rejectionReason?: string;
}

export interface IDecideLoanResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: TLoanStatus;
    disbursedAmount?: number;
    transactionId?: string;
  };
}
export interface IRepayLoanPayload {
  id: string;
  amount?: number;
}

export interface IRepayLoanResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    status: TLoanStatus;
    paidAmount: number;
    remainingBalance: number;
    transactionId: string;
  };
}
export type TRepaymentTimeliness =
  | "No Previous Loan"
  | "Timely Paid"
  | "Late / Missed Installment"
  | "Partially Paid / Active";

export interface IApplicantInfoPayload {
  currentLoan: {
    id: string;
    loanType: string;
    requestedAmount: number;
    durationMonths: number;
    interestRate: number;
    totalPayable: number;
    monthlyInstallment: number;
    status: string;
    description: string;
    staffNotes: string;
    createdAt: string;
  };
  applicant: {
    name: string;
    email: string;
    phone: string;
    status: string;
    kycVerified: boolean;
    monthlyIncome: number;
    employmentStatus: string;
  };
  account: {
    accountNumber: string;
    accountType: string;
    balance: number;
    currency: string;
    status: string;
  } | null;
  lastLoan: {
    id: string;
    loanType: string;
    requestedAmount: number;
    totalPayable: number;
    remainingBalance: number;
    durationMonths: number;
    status: string;
    paidAmount: number;
    repaymentTimeliness: TRepaymentTimeliness;
    createdAt: string;
  } | null;
}
