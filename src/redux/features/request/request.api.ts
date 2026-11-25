import { baseApi } from "@/redux/baseApi";
import type {
  ICreateRequestPayload,
  IDecideRequestPayload,
  IDepositWithdrawalRequest,
} from "@/types/request.type";

export const requestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRequests: builder.query<
      { success: boolean; message: string; data: IDepositWithdrawalRequest[] },
      void
    >({
      query: () => "/requests",
      providesTags: ["transactions"],
    }),
    createRequest: builder.mutation<
      { success: boolean; message: string; data: IDepositWithdrawalRequest },
      ICreateRequestPayload
    >({
      query: (body) => ({
        url: "/requests",
        method: "POST",
        body,
      }),
      invalidatesTags: ["transactions", "accounts"],
    }),
    decideRequest: builder.mutation<
      { success: boolean; message: string },
      IDecideRequestPayload
    >({
      query: ({ id, ...body }) => ({
        url: `/requests/${encodeURIComponent(id)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["transactions", "accounts"],
    }),
  }),
});

export const {
  useGetRequestsQuery,
  useCreateRequestMutation,
  useDecideRequestMutation,
} = requestApi;