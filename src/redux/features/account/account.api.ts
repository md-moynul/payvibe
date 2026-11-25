import { baseApi } from "@/redux/baseApi";
import type {
  IAccount,
  IAccountsListResponse,
  IUpdateAccountLimitsPayload,
  IUpdateAccountStatusPayload,
  TAccountType,
} from "@/types/account.type";

export interface ICreateAccountPayload {
  ownerEmail: string;
  accountType: TAccountType;
  initialBalance?: number;
  dailyLimit?: number;
  maxSingleTransaction?: number;
  minBalance?: number;
}

export interface IAccountResponse {
  success: boolean;
  message: string;
  data: IAccount;
}

export const accountApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAccount: builder.mutation<IAccountResponse, ICreateAccountPayload>({
      query: (payload) => ({
        url: "/accounts",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["accounts"],
    }),
    getAccounts: builder.query<IAccountsListResponse, void>({
      query: () => "/accounts",
      providesTags: ["accounts"],
    }),
    getAccountById: builder.query<IAccountResponse, string>({
      query: (id) => `/accounts/${encodeURIComponent(id)}`,
      providesTags: ["accounts"],
    }),
    updateAccountStatus: builder.mutation<
      IAccountResponse,
      IUpdateAccountStatusPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/accounts/${encodeURIComponent(id)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["accounts"],
    }),
    updateAccountLimits: builder.mutation<
      IAccountResponse,
      IUpdateAccountLimitsPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/accounts/${encodeURIComponent(id)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["accounts"],
    }),
  }),
});

export const {
  useCreateAccountMutation,
  useGetAccountByIdQuery,
  useGetAccountsQuery,
  useUpdateAccountStatusMutation,
  useUpdateAccountLimitsMutation,
} = accountApi;
