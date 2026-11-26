export const REPAYMENT_START_DAY = 1;
export const REPAYMENT_END_DAY = 10;

export interface IRepaymentWindowStatus {
  isOpen: boolean;
  dayOfMonth: number;
  message: string;
}

export function getRepaymentWindowStatus(
  now: Date = new Date(),
): IRepaymentWindowStatus {
  const dayOfMonth = now.getDate();
  const isOpen =
    dayOfMonth >= REPAYMENT_START_DAY && dayOfMonth <= REPAYMENT_END_DAY;

  if (isOpen) {
    return {
      isOpen: true,
      dayOfMonth,
      message: `Installment payment window is open (${REPAYMENT_START_DAY}th – ${REPAYMENT_END_DAY}th of every month).`,
    };
  }

  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, REPAYMENT_START_DAY);
  const nextStartFormatted = nextMonth.toLocaleDateString("en-BD", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return {
    isOpen: false,
    dayOfMonth,
    message: `Loan installments can only be paid between the ${REPAYMENT_START_DAY}st and ${REPAYMENT_END_DAY}th of each month. Next window opens on ${nextStartFormatted}.`,
  };
}