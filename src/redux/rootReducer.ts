import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth.slice";

export const rootReducer = combineReducers({
    // add your reducers here
    auth: authReducer,
})