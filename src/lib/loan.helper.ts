export function getDefaultInterestRateByType(loanType: string): number {
  switch (loanType) {
    case "Home Loan":
      return 9;
    case "Education Loan":
      return 8.5;
    case "Auto Loan":
      return 10.5;
    case "Business Loan":
      return 13;
    case "Personal Loan":
    default:
      return 12;
  }
}

export function calculateLoanSummary(params: {
  principal: number;
  annualInterestRate: number;
  durationMonths: number;
}) {
  const principal = Math.max(0, Number(params.principal) || 0);
  const rate = Math.max(0, Number(params.annualInterestRate) || 0);
  const months = Math.max(1, Number(params.durationMonths) || 12);

  // Simple annual interest over loan duration in years
  const years = months / 12;
  const totalInterest = Number(((principal * rate * years) / 100).toFixed(2));
  const totalPayable = Number((principal + totalInterest).toFixed(2));
  const monthlyInstallment = Number((totalPayable / months).toFixed(2));

  return {
    annualInterestRate: rate,
    totalInterest,
    totalPayable,
    monthlyInstallment,
  };
}