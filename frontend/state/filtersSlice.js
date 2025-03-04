import { createSlice } from "@reduxjs/toolkit";

const filtersSlice = createSlice({
  name: "filters",
  initialState: { size: "All" },
  reducers: {
    updateFilter(state, action) {
      state.size = action.payload;
    },
  },
});

export const { updateFilter } = filtersSlice.actions;

export default filtersSlice.reducer;
