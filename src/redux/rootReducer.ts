import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth.slice";
import accountReducer from "./features/account/account.slice";
import customerReducer from "./features/customer/customer.slice";
import { baseApi } from "./baseApi";

export const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  account: accountReducer,
  customer: customerReducer,
});