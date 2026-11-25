import { baseApi } from "@/redux/baseApi";
import {
  ICustomersResponse,
  IRegisterCustomerPayload,
  IRegisterCustomerResponse,
} from "@/types/account.type";
import { IUpdateCustomerKycPayload, IUpdateCustomerKycResponse } from "@/types/auth.type";

export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<ICustomersResponse, void>({
      query: () => "/customers",
      providesTags: ["customers"],
    }),
    registerCustomer: builder.mutation<
      IRegisterCustomerResponse,
      IRegisterCustomerPayload
    >({
      query: (payload) => ({
        url: "/customers",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["customers"],
    }),
    updateCustomerKyc: builder.mutation<
      IUpdateCustomerKycResponse,
      IUpdateCustomerKycPayload
    >({
      query: ({ id, kycVerified }) => ({
        url: `/customers/${id}/kyc`,
        method: "PATCH",
        body: { kycVerified },
      }),
      invalidatesTags: ["customers"],
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useRegisterCustomerMutation,
  useUpdateCustomerKycMutation,
} = customerApi;
