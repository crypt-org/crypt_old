import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';
import User from '../../user/constants';
import UserService from '../../user';

const initialState: User = UserService.GetDefaultUser();

// Redux Slice
export const userReduxSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser: (state: WritableDraft<User>, action?: PayloadAction<User>) => {
      state = initialState;
    },
  },
});

// Action Types
export const { resetUser } = userReduxSlice.actions;

export default userReduxSlice.reducer;
