import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface WrapperState {
  isLoading: boolean;
}

const initialState: WrapperState = {
  isLoading: false,
};

const wrapperSlice = createSlice({
  name: "wrapper",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoading } = wrapperSlice.actions;

export default wrapperSlice.reducer;
