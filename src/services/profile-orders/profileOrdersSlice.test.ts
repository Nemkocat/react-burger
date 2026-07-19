import { describe, expect, it } from 'vitest';

import { mockOrder } from '@utils/test-mocks';

import {
  clearCurrentOrder,
  fetchOrderByNumber,
  profileOrdersClose,
  profileOrdersConnect,
  profileOrdersConnecting,
  profileOrdersDisconnect,
  profileOrdersError,
  profileOrdersInvalidToken,
  profileOrdersMessage,
  profileOrdersOpen,
  profileOrdersSlice,
} from './profileOrdersSlice';

const reducer = profileOrdersSlice.reducer;
const initialState = reducer(undefined, { type: 'unknown' });

describe('profileOrdersSlice', () => {
  it('should return the initial state', () => {
    expect(initialState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isConnected: false,
      isConnecting: false,
      error: null,
      currentOrder: null,
      currentOrderLoading: false,
      currentOrderError: null,
    });
  });

  it('should handle profileOrdersConnect', () => {
    const state = reducer(
      { ...initialState, error: 'old' },
      profileOrdersConnect('wss://example.com')
    );

    expect(state.isConnecting).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle profileOrdersDisconnect', () => {
    const state = reducer(
      { ...initialState, isConnected: true, isConnecting: true },
      profileOrdersDisconnect()
    );

    expect(state.isConnected).toBe(false);
    expect(state.isConnecting).toBe(false);
  });

  it('should handle profileOrdersConnecting and open', () => {
    const connecting = reducer(initialState, profileOrdersConnecting());
    expect(connecting.isConnecting).toBe(true);

    const opened = reducer(connecting, profileOrdersOpen());
    expect(opened).toMatchObject({
      isConnected: true,
      isConnecting: false,
      error: null,
    });
  });

  it('should handle profileOrdersClose', () => {
    const state = reducer(
      { ...initialState, isConnected: true, isConnecting: true },
      profileOrdersClose()
    );

    expect(state.isConnected).toBe(false);
    expect(state.isConnecting).toBe(false);
  });

  it('should handle profileOrdersError', () => {
    const state = reducer(initialState, profileOrdersError('error'));

    expect(state.error).toBe('error');
    expect(state.isConnecting).toBe(false);
  });

  it('should handle profileOrdersInvalidToken', () => {
    const state = reducer(
      { ...initialState, isConnecting: true },
      profileOrdersInvalidToken()
    );

    expect(state.error).toBe('Invalid or missing token');
    expect(state.isConnecting).toBe(false);
  });

  it('should handle successful profileOrdersMessage', () => {
    const state = reducer(
      initialState,
      profileOrdersMessage({
        success: true,
        orders: [mockOrder],
        total: 10,
        totalToday: 2,
      })
    );

    expect(state.orders).toHaveLength(1);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(2);
  });

  it('should handle failed profileOrdersMessage', () => {
    const state = reducer(
      initialState,
      profileOrdersMessage({ success: false, message: 'nope' })
    );

    expect(state.error).toBe('nope');
  });

  it('should handle fetchOrderByNumber.pending', () => {
    const state = reducer(
      { ...initialState, currentOrderError: 'old' },
      fetchOrderByNumber.pending('', 123)
    );

    expect(state.currentOrderLoading).toBe(true);
    expect(state.currentOrderError).toBeNull();
  });

  it('should handle fetchOrderByNumber.fulfilled', () => {
    const state = reducer(
      { ...initialState, currentOrderLoading: true },
      fetchOrderByNumber.fulfilled(mockOrder, '', 12345)
    );

    expect(state.currentOrder).toEqual(mockOrder);
    expect(state.currentOrderLoading).toBe(false);
  });

  it('should handle fetchOrderByNumber.rejected', () => {
    const state = reducer(
      { ...initialState, currentOrderLoading: true },
      fetchOrderByNumber.rejected(null, '', 1, 'Не удалось загрузить заказ')
    );

    expect(state.currentOrderLoading).toBe(false);
    expect(state.currentOrderError).toBe('Не удалось загрузить заказ');
  });

  it('should clear current order', () => {
    const filled = reducer(
      initialState,
      fetchOrderByNumber.fulfilled(mockOrder, '', 12345)
    );
    const state = reducer(filled, clearCurrentOrder());

    expect(state.currentOrder).toBeNull();
    expect(state.currentOrderLoading).toBe(false);
    expect(state.currentOrderError).toBeNull();
  });
});
