import { describe, expect, it } from 'vitest';

import { mockOrder } from '@utils/test-mocks';

import {
  feedOrdersClose,
  feedOrdersConnect,
  feedOrdersConnecting,
  feedOrdersDisconnect,
  feedOrdersError,
  feedOrdersMessage,
  feedOrdersOpen,
  feedOrdersSlice,
} from './feedOrdersSlice';

const reducer = feedOrdersSlice.reducer;
const initialState = reducer(undefined, { type: 'unknown' });

describe('feedOrdersSlice', () => {
  it('should return the initial state', () => {
    expect(initialState).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      isConnected: false,
      isConnecting: false,
      isLoaded: false,
      error: null,
    });
  });

  it('should handle feedOrdersConnect', () => {
    const state = reducer(
      { ...initialState, error: 'old' },
      feedOrdersConnect('wss://example.com')
    );

    expect(state.isConnecting).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle feedOrdersDisconnect', () => {
    const state = reducer(
      { ...initialState, isConnected: true, isConnecting: true },
      feedOrdersDisconnect()
    );

    expect(state.isConnected).toBe(false);
    expect(state.isConnecting).toBe(false);
  });

  it('should handle feedOrdersConnecting', () => {
    const state = reducer({ ...initialState, error: 'old' }, feedOrdersConnecting());

    expect(state.isConnecting).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle feedOrdersOpen', () => {
    const state = reducer(
      { ...initialState, isConnecting: true, error: 'old' },
      feedOrdersOpen()
    );

    expect(state).toMatchObject({
      isConnected: true,
      isConnecting: false,
      error: null,
    });
  });

  it('should handle feedOrdersClose', () => {
    const state = reducer(
      { ...initialState, isConnected: true, isConnecting: true },
      feedOrdersClose()
    );

    expect(state.isConnected).toBe(false);
    expect(state.isConnecting).toBe(false);
  });

  it('should handle feedOrdersError', () => {
    const state = reducer(
      { ...initialState, isConnecting: true },
      feedOrdersError('socket error')
    );

    expect(state.error).toBe('socket error');
    expect(state.isConnecting).toBe(false);
  });

  it('should handle successful feedOrdersMessage', () => {
    const state = reducer(
      initialState,
      feedOrdersMessage({
        success: true,
        orders: [mockOrder],
        total: 100,
        totalToday: 5,
      })
    );

    expect(state.orders).toHaveLength(1);
    expect(state.orders[0].number).toBe(mockOrder.number);
    expect(state.total).toBe(100);
    expect(state.totalToday).toBe(5);
    expect(state.error).toBeNull();
  });

  it('should handle failed feedOrdersMessage', () => {
    const state = reducer(
      initialState,
      feedOrdersMessage({ success: false, message: 'fail' })
    );

    expect(state.error).toBe('fail');
  });

  it('should skip invalid orders in feedOrdersMessage', () => {
    const state = reducer(
      initialState,
      feedOrdersMessage({
        success: true,
        orders: [{ ...mockOrder, ingredients: [] }, mockOrder] as never,
        total: 2,
        totalToday: 1,
      })
    );

    expect(state.orders).toHaveLength(1);
    expect(state.orders[0]._id).toBe(mockOrder._id);
  });
});
