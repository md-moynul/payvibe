

import { baseApi } from "@/redux/baseApi";
import { ICustomersResponse, IRegisterCustomerPayload, IRegisterCustomerResponse } from "@/types/account.type";



export const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCustomers: builder.query<ICustomersResponse, void>({
      query: () => "/customers",
      providesTags: ["Customers"],
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
      invalidatesTags: ["Customers"],
    }),
  }),
});

export const { useGetCustomersQuery, useRegisterCustomerMutation } =
  customerApi;