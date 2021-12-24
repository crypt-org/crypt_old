import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';
import Crypt from '../../crypt/constants';
import CryptService from '../../crypt';

const initialState: Crypt = CryptService.GetNewCrypt();

// Redux Slice
export const cryptReduxSlice = createSlice({
  name: 'crypt',
  initialState,
  reducers: {
    resetCrypt: (
      state: WritableDraft<Crypt>,
      action?: PayloadAction<Crypt>
    ) => {
      state = initialState;
    },
  },
});

// Action Types
export const { resetCrypt } = cryptReduxSlice.actions;

export default cryptReduxSlice.reducer;
