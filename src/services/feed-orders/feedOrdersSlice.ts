import { createSlice } from '@reduxjs/toolkit';

import { filterValidOrders } from '@utils/orders';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { TOrder, TOrdersSocketMessage } from '@utils/types';

type TFeedOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
};

const initialState: TFeedOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  isConnecting: false,
  error: null,
};

export const feedOrdersSlice = createSlice({
  name: 'feedOrders',
  initialState,
  reducers: {
    feedOrdersConnect: (state, _action: PayloadAction<string>) => {
      state.isConnecting = true;
      state.error = null;
    },
    feedOrdersDisconnect: (state) => {
      state.isConnected = false;
      state.isConnecting = false;
    },
    feedOrdersConnecting: (state) => {
      state.isConnecting = true;
      state.error = null;
    },
    feedOrdersOpen: (state) => {
      state.isConnected = true;
      state.isConnecting = false;
      state.error = null;
    },
    feedOrdersClose: (state) => {
      state.isConnected = false;
      state.isConnecting = false;
    },
    feedOrdersError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isConnecting = false;
    },
    feedOrdersMessage: (state, action: PayloadAction<TOrdersSocketMessage>) => {
      const payload = action.payload;

      if (!('orders' in payload) || !payload.success) {
        state.error = 'message' in payload ? payload.message : 'Ошибка ленты заказов';
        return;
      }

      state.orders = filterValidOrders(payload.orders);
      state.total = payload.total;
      state.totalToday = payload.totalToday;
      state.error = null;
    },
  },
  selectors: {
    selectFeedOrders: (state) => state.orders,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday,
    selectFeedOrdersConnected: (state) => state.isConnected,
    selectFeedOrdersConnecting: (state) => state.isConnecting,
    selectFeedOrdersError: (state) => state.error,
  },
});

export const {
  feedOrdersConnect,
  feedOrdersDisconnect,
  feedOrdersConnecting,
  feedOrdersOpen,
  feedOrdersClose,
  feedOrdersError,
  feedOrdersMessage,
} = feedOrdersSlice.actions;
