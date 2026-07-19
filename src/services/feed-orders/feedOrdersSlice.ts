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
  isLoaded: boolean;
  error: string | null;
};

const initialState: TFeedOrdersState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isConnected: false,
  isConnecting: false,
  isLoaded: false,
  error: null,
};

export const feedOrdersSlice = createSlice({
  name: 'feedOrders',
  initialState,
  reducers: {
    feedOrdersConnect: (state, _action: PayloadAction<string>) => {
      state.isConnecting = true;
      state.isLoaded = false;
      state.error = null;
    },
    feedOrdersDisconnect: (state) => {
      state.isConnected = false;
      state.isConnecting = false;
      state.isLoaded = false;
      state.orders = [];
      state.total = 0;
      state.totalToday = 0;
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
      state.isLoaded = true;
    },
    feedOrdersMessage: (state, action: PayloadAction<TOrdersSocketMessage>) => {
      const payload = action.payload;

      if (!('orders' in payload) || !payload.success) {
        state.error = 'message' in payload ? payload.message : 'Ошибка ленты заказов';
        state.isLoaded = true;
        return;
      }

      state.orders = filterValidOrders(payload.orders);
      state.total = payload.total;
      state.totalToday = payload.totalToday;
      state.error = null;
      state.isLoaded = true;
    },
  },
  selectors: {
    selectFeedOrders: (state) => state.orders,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday,
    selectFeedOrdersConnected: (state) => state.isConnected,
    selectFeedOrdersConnecting: (state) => state.isConnecting,
    selectFeedOrdersLoaded: (state) => state.isLoaded,
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
