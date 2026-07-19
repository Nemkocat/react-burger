import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { getOrderByNumber } from '@utils/api';
import { filterValidOrders, isValidOrder } from '@utils/orders';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder, TOrdersSocketMessage } from '@utils/types';

type TProfileOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  currentOrder: TOrder | null;
  currentOrderLoading: boolean;
  currentOrderError: string | null;
};

const initialState: TProfileOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  isConnecting: false,
  error: null,
  currentOrder: null,
  currentOrderLoading: false,
  currentOrderError: null,
};

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number | string,
  { rejectValue: string }
>('profileOrders/fetchOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const order = await getOrderByNumber(number);

    if (!isValidOrder(order)) {
      return rejectWithValue('Некорректные данные заказа');
    }

    return {
      ...order,
      name: typeof order.name === 'string' ? order.name : '',
    };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Не удалось загрузить заказ';
    return rejectWithValue(message);
  }
});

export const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {
    profileOrdersConnect: (state, _action: PayloadAction<string>) => {
      state.isConnecting = true;
      state.error = null;
    },
    profileOrdersDisconnect: (state) => {
      state.isConnected = false;
      state.isConnecting = false;
    },
    profileOrdersConnecting: (state) => {
      state.isConnecting = true;
      state.error = null;
    },
    profileOrdersOpen: (state) => {
      state.isConnected = true;
      state.isConnecting = false;
      state.error = null;
    },
    profileOrdersClose: (state) => {
      state.isConnected = false;
      state.isConnecting = false;
    },
    profileOrdersError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isConnecting = false;
    },
    profileOrdersInvalidToken: (state) => {
      state.error = 'Invalid or missing token';
      state.isConnecting = false;
    },
    profileOrdersMessage: (state, action: PayloadAction<TOrdersSocketMessage>) => {
      const payload = action.payload;

      if (!('orders' in payload) || !payload.success) {
        state.error = 'message' in payload ? payload.message : 'Ошибка истории заказов';
        return;
      }

      state.orders = filterValidOrders(payload.orders);
      state.total = payload.total;
      state.totalToday = payload.totalToday;
      state.error = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.currentOrderError = null;
      state.currentOrderLoading = false;
    },
  },
  selectors: {
    selectProfileOrders: (state) => state.orders,
    selectProfileOrdersConnected: (state) => state.isConnected,
    selectProfileOrdersConnecting: (state) => state.isConnecting,
    selectProfileOrdersError: (state) => state.error,
    selectCurrentOrder: (state) => state.currentOrder,
    selectCurrentOrderLoading: (state) => state.currentOrderLoading,
    selectCurrentOrderError: (state) => state.currentOrderError,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.currentOrderLoading = true;
        state.currentOrderError = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.currentOrderLoading = false;
        state.currentOrderError = action.payload ?? 'Не удалось загрузить заказ';
      });
  },
});

export const {
  profileOrdersConnect,
  profileOrdersDisconnect,
  profileOrdersConnecting,
  profileOrdersOpen,
  profileOrdersClose,
  profileOrdersError,
  profileOrdersInvalidToken,
  profileOrdersMessage,
  clearCurrentOrder,
} = profileOrdersSlice.actions;
