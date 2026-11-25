import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { IDummyCustomer } from "@/components/customer/CustomerStatsGrid";
import { ICustomerState } from "@/types/customer.type";

const initialState: ICustomerState = {
  customers: [],
  selectedCustomerEmail: null,
  loading: false,
  error: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    setCustomers: (state, action: PayloadAction<IDummyCustomer[]>) => {
      state.customers = action.payload;
      state.error = null;
    },
    addCustomer: (state, action: PayloadAction<IDummyCustomer>) => {
      state.customers.unshift(action.payload);
      state.error = null;
    },
    setSelectedCustomerEmail: (state, action: PayloadAction<string | null>) => {
      state.selectedCustomerEmail = action.payload;
    },
    setCustomerError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setCustomers,
  addCustomer,
  setSelectedCustomerEmail,
  setCustomerError,
} = customerSlice.actions;

export default customerSlice.reducer;
