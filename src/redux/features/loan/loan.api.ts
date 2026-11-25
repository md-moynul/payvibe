import { baseApi } from "@/redux/baseApi";
import type {
  IApplyLoanPayload,
  IApplyLoanResponse,
  IDecideLoanPayload,
  IDecideLoanResponse,
  ILoansResponse,
  IRepayLoanPayload,
  IRepayLoanResponse,
  IReviewLoanPayload,
  IReviewLoanResponse,
} from "@/types/loan.type";

export const loanApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getLoans: builder.query<ILoansResponse, void>({
      query: () => "/loans",
      providesTags: ["loans"],
    }),
    applyLoan: builder.mutation<IApplyLoanResponse, IApplyLoanPayload>({
      query: (payload) => ({
        url: "/loans",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["loans"],
    }),
    reviewLoan: builder.mutation<IReviewLoanResponse, IReviewLoanPayload>({
      query: ({ id, staffNotes, status = "Under Review" }) => ({
        url: `/loans/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: { staffNotes, status },
      }),
      invalidatesTags: ["loans"],
    }),
    decideLoan: builder.mutation<IDecideLoanResponse, IDecideLoanPayload>({
      query: ({ id, status, rejectionReason }) => ({
        url: `/loans/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: { status, rejectionReason },
      }),
      invalidatesTags: ["loans", "accounts", "transactions"],
    }),
    repayLoan: builder.mutation<IRepayLoanResponse, IRepayLoanPayload>({
      query: ({ id, amount }) => ({
        url: `/loans/${encodeURIComponent(id)}/repay`,
        method: "POST",
        body: amount !== undefined ? { amount } : {},
      }),
      invalidatesTags: ["loans", "accounts", "transactions"],
    }),
  }),
});

export const {
  useGetLoansQuery,
  useApplyLoanMutation,
  useReviewLoanMutation,
  useDecideLoanMutation,
  useRepayLoanMutation,
} = loanApi;
