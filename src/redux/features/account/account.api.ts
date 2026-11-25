import { baseApi } from "@/redux/baseApi";
import type { IAccount, TAccountType } from "@/types/account.type";

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
      invalidatesTags: ["Accounts"],
    }),
    getAccountById: builder.query<IAccountResponse, string>({
      query: (id) => `/accounts/${encodeURIComponent(id)}`,
      providesTags: ["Accounts"],
    }),
  }),
});

export const { useCreateAccountMutation, useGetAccountByIdQuery } = accountApi;
