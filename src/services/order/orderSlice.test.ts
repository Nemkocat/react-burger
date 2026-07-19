import { describe, expect, it } from 'vitest';

import { orderSlice, resetOrder } from './orderSlice';
import { createOrder } from './orderThunk';

const reducer = orderSlice.reducer;
const initialState = reducer(undefined, { type: 'unknown' });

const orderResponse = {
  success: true,
  name: 'Space бургер',
  order: { number: 4242 },
};

describe('orderSlice', () => {
  it('should return the initial state', () => {
    expect(initialState).toEqual({
      name: null,
      number: null,
      isLoading: false,
      error: null,
    });
  });

  it('should handle createOrder.pending', () => {
    const state = reducer(
      { ...initialState, error: 'old' },
      createOrder.pending('', undefined)
    );

    expect(state).toEqual({
      name: null,
      number: null,
      isLoading: true,
      error: null,
    });
  });

  it('should handle createOrder.fulfilled', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      createOrder.fulfilled(orderResponse, '', undefined)
    );

    expect(state).toEqual({
      name: 'Space бургер',
      number: 4242,
      isLoading: false,
      error: null,
    });
  });

  it('should handle createOrder.rejected with payload', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      createOrder.rejected(null, '', undefined, 'Добавьте булку')
    );

    expect(state).toEqual({
      name: null,
      number: null,
      isLoading: false,
      error: 'Добавьте булку',
    });
  });

  it('should handle createOrder.rejected without payload', () => {
    const state = reducer(
      { ...initialState, isLoading: true },
      createOrder.rejected(new Error('fail'), '', undefined)
    );

    expect(state.error).toBe('fail');
    expect(state.isLoading).toBe(false);
  });

  it('should reset order', () => {
    const filled = reducer(
      initialState,
      createOrder.fulfilled(orderResponse, '', undefined)
    );
    const state = reducer(filled, resetOrder());

    expect(state).toEqual(initialState);
  });
});
