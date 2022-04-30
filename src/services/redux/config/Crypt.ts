import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WritableDraft } from 'immer/dist/internal';
import CryptModel from '../../../models/crypt';
import CryptService from '../../crypt';

const initialState: CryptModel = CryptService.GetNewCrypt();

// Redux Slice
export const cryptReduxSlice = createSlice({
  name: 'crypt',
  initialState,
  reducers: {
    resetCrypt: (
      state: WritableDraft<CryptModel>,
      action?: PayloadAction<CryptModel>
    ) => {
      state.accounts = initialState.accounts;
    },
    updateCrypt: (
      state: WritableDraft<CryptModel>,
      action?: PayloadAction<CryptModel>
    ) => {
      state.accounts = initialState.accounts;
    },
  },
});

// Action Types
export const { resetCrypt, updateCrypt } = cryptReduxSlice.actions;

export default cryptReduxSlice.reducer;
