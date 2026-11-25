import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { TStaffStatus } from "@/types/staff.type";

export type TStaffStatusFilter = "ALL" | TStaffStatus;

interface IStaffState {
  selectedStaffId: string | null;
  searchQuery: string;
  statusFilter: TStaffStatusFilter;
}

const initialState: IStaffState = {
  selectedStaffId: null,
  searchQuery: "",
  statusFilter: "ALL",
};

const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    selectStaff(state, action: PayloadAction<string | null>) {
      state.selectedStaffId = action.payload;
    },
    setStaffSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setStaffStatusFilter(state, action: PayloadAction<TStaffStatusFilter>) {
      state.statusFilter = action.payload;
    },
    resetStaffFilters(state) {
      state.searchQuery = "";
      state.statusFilter = "ALL";
    },
  },
});

export const {
  selectStaff,
  setStaffSearchQuery,
  setStaffStatusFilter,
  resetStaffFilters,
} = staffSlice.actions;

export default staffSlice.reducer;