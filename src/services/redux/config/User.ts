import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';
import UserState, { Factory_UserState } from '../interfaces/user';

const initialState: UserState = Factory_UserState.ResetUserState();

// Redux Slice
export const userReduxSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser: (
      state: WritableDraft<UserState>,
      action?: PayloadAction<UserState>
    ) => {
      state = initialState;
    },
  },
});

// Action Types
export const { resetUser } = userReduxSlice.actions;

export default userReduxSlice.reducer;
