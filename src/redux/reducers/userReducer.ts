/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  userInfo: any;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  token: string | null;
  refresh_token: string | null;
  role: string | null;
}

const initialState: UserState = {
  userInfo: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  token: null,
  refresh_token: null,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setLaoding: (state, action) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
      state.token = null;
      state.refresh_token = null;
      state.error = null;
      state.role = null;
      localStorage.clear();
    },
  },
});

export const { logout, setLaoding } = userSlice.actions;
export default userSlice.reducer;
