import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';
import CryptState, { Factory_CryptState } from '../interfaces/crypt';

const initialState: CryptState = Factory_CryptState.ResetUserState();

// Redux Slice
export const cryptReduxSlice = createSlice({
  name: 'crypt',
  initialState,
  reducers: {
    resetCrypt: (
      state: WritableDraft<CryptState>,
      action?: PayloadAction<CryptState>
    ) => {
      state = initialState;
    },
  },
});

// Action Types
export const { resetCrypt } = cryptReduxSlice.actions;

export default cryptReduxSlice.reducer;
