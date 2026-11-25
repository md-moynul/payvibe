

import { baseApi } from "@/redux/baseApi";
import { ICustomersResponse, IRegisterCustomerPayload, IRegisterCustomerResponse } from "@/types/account.type";



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
  }),
});

export const { useGetCustomersQuery, useRegisterCustomerMutation } =
  customerApi;