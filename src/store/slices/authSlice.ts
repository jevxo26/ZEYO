import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number | string;
  name: string;
  email: string;
  role: string;
  supportedServiceKeys?: string[];
  supportedZoneIds?: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: User; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },
    restoreUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setCredentials, restoreUser, logout } = authSlice.actions;
export default authSlice.reducer;