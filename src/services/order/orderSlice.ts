import { createSlice } from '@reduxjs/toolkit';

import { createOrder } from './orderThunk';

type TOrderState = {
  name: string | null;
  number: number | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  name: null,
  number: null,
  isLoading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.name = null;
      state.number = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.name = action.payload.name;
        state.number = action.payload.order.number;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : (action.error.message ?? 'Ошибка заказа');
      });
  },
  selectors: {
    selectOrderName: (state) => state.name,
    selectOrderNumber: (state) => state.number,
    selectOrderLoading: (state) => state.isLoading,
    selectOrderError: (state) => state.error,
  },
});

export const { resetOrder } = orderSlice.actions;
