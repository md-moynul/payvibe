import type { RootState } from "@/redux/store";

export const selectSelectedAccountId = (state: RootState) =>
  state.account.selectedAccountId;
