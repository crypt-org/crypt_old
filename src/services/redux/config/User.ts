import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';
import UserModel from '../../../models/user';
import UserService from '../../user';

const initialState: UserModel = UserService.GetDefaultUser();

// Redux Slice
export const userReduxSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser: (
      state: WritableDraft<UserModel>,
      action?: PayloadAction<UserModel>
    ) => {
      state.email = initialState.email;
      state.name = initialState.name;
      state.pub = initialState.pub;
      state.uid = initialState.uid;
    },
    loginUser: (
      state: WritableDraft<UserModel>,
      action: PayloadAction<UserModel>
    ) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.pub = action.payload.pub;
      state.uid = action.payload.uid;
    },
  },
});

// Action Types
export const { resetUser, loginUser } = userReduxSlice.actions;

export default userReduxSlice.reducer;
