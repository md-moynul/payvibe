import { IAccount, IAccountState } from "@/types/account.type";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IAccountState = {
  accounts: [],
  selectedAccountId: null,
  loading: false,
  error: null,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    addAccount(state, action: PayloadAction<IAccount>) {
      state.accounts.unshift(action.payload);
      if (!state.selectedAccountId) {
        state.selectedAccountId = action.payload.id;
      }
      state.loading = false;
      state.error = null;
    },
    setAccounts(state, action: PayloadAction<IAccount[]>) {
      state.accounts = action.payload;
      state.loading = false;
      state.error = null;

      const exists = action.payload.some(
        (acc) => acc.id === state.selectedAccountId,
      );
      if (!exists) {
        state.selectedAccountId = action.payload[0]?.id ?? null;
      }
    },
    selectAccount(state, action: PayloadAction<string | null>) {
      state.selectedAccountId = action.payload;
    },
  },
});
export const { setAccounts, selectAccount ,addAccount} = accountSlice.actions;
export default accountSlice.reducer;
