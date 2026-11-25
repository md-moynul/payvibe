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
