import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AuthService from "../../fireauth";

// State Data
interface ServiceState {
  AuthService?: AuthService
};

const initialState: ServiceState = {
  AuthService: undefined
};

// Redux Slice
export const servicesReduxSlice = createSlice({
  name: 'firebase',
  initialState,
  reducers: {
    initAuthService: (state, action: PayloadAction<AuthService>) => {
      state.AuthService = action.payload
    }
  }
});

// Action Types
export const { initAuthService } = servicesReduxSlice.actions;

export default servicesReduxSlice.reducer;