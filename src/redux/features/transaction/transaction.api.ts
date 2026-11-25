import { baseApi } from "@/redux/baseApi";
import type {
  ITransactionsQueryParams,
  ITransactionsResponse,
  ITransferFundsPayload,
  ITransferFundsResponse,
  IUpdateTransactionPayload,
} from "@/types/transaction.type";

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<
      ITransactionsResponse,
      ITransactionsQueryParams | void
    >({
      query: (params) => {
        const sp = new URLSearchParams();
        if (params?.search?.trim()) sp.set("search", params.search.trim());
        if (params?.type && params.type !== "ALL") sp.set("type", params.type);
        if (params?.status && params.status !== "ALL")
          sp.set("status", params.status);
        if (params?.from) sp.set("from", params.from);
        if (params?.to) sp.set("to", params.to);
        if (params?.page) sp.set("page", String(params.page));
        if (params?.limit) sp.set("limit", String(params.limit));

        const qs = sp.toString();
        return qs ? `/transactions?${qs}` : "/transactions";
      },
      providesTags: ["transactions"],
    }),

    transferFunds: builder.mutation<
      ITransferFundsResponse,
      ITransferFundsPayload
    >({
      query: (payload) => ({
        url: "/transactions/transfer",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["transactions", "accounts"],
    }),

    updateTransaction: builder.mutation<
      { success: boolean; message: string },
      IUpdateTransactionPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/transactions/${encodeURIComponent(id)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["transactions", "accounts"],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useTransferFundsMutation,
  useUpdateTransactionMutation,
} = transactionApi;