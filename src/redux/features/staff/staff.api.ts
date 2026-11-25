import { baseApi } from "@/redux/baseApi";
import type {
  ICreateStaffPayload,
  IStaffListResponse,
  IStaffResponse,
  IUpdateStaffPayload,
} from "@/types/staff.type";

// TODO: Confirm tag name ("Staff" vs "Users") and backend routes (/api/staff, /api/staff/[id])

export const staffApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaffList: builder.query<IStaffListResponse, void>({
      query: () => "/staff",
      providesTags: ["staff"],
    }),
    createStaff: builder.mutation<IStaffResponse, ICreateStaffPayload>({
      query: (payload) => ({
        url: "/staff",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["staff"],
    }),
    updateStaff: builder.mutation<IStaffResponse, IUpdateStaffPayload>({
      query: ({ id, ...body }) => ({
        url: `/staff/${encodeURIComponent(id)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["staff"],
    }),
  }),
});

export const {
  useGetStaffListQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
} = staffApi;